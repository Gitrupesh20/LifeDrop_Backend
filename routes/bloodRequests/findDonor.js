const router = require("express").Router();

const { calculateAge } = require("../../controllers/appUsersControllers/auth");
const Donor = require("../../model/Donor");

router.get("/", async (req, res) => {
  const { bloodGroup, city, pincode, pageNo, limit = 5 } = req.query;

  const query = {
    bloodGroup: bloodGroup,
    city: city,
    pincode: pincode,
    //AvalibilityStatus: true,
  };

  try {
    const donors = await Donor.find(query, " bloodGroup  streetAddress id")
      .populate({
        path: "user",
        match: { isEmailVerified: true },
        select: "firstName lastName dateOfBirth gender",
      })
      .skip(pageNo * limit)
      .limit(limit);
    // filter donor where user is null
    const filteredDonors = donors.filter((donor) => donor.user !== null);
    const rows = filteredDonors.map((item) => {
      return {
        firstName: item?.user?.firstName,
        lastName: item?.user?.lastName,
        bloodGroup: item?.bloodGroup,
        age: calculateAge(item?.user?.dateOfBirth),
        streetAddress: item?.streetAddress,
        gender: item?.user?.gender,
        id: item?.id,
      };
    });

    const numberOfElements = filteredDonors?.length;
    const numberOfPages = Math.ceil(numberOfElements / limit);

    res.status(200).json({ donors: rows, numberOfPages, numberOfElements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "internal Error" });
  }
});

module.exports = router;
