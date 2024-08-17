import axios from "axios";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import {
  AiFillStar,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloseCircle,
  AiOutlineDollarCircle,
  AiOutlineEnvironment,
  AiOutlineFieldTime,
  AiOutlineInfoCircle,
  AiOutlineStar,
} from "react-icons/ai"; // Import icons from react-icons
import { BsBook } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { selectedPackageAtom } from "./TourPackage";

const PackageDetails = () => {
  const [packageData, setPackageData] = useAtom(selectedPackageAtom);

  // Fetch package details from localStorage
  useEffect(() => {
    const storedPackage = JSON.parse(localStorage.getItem("selectedPackage"));
    if (storedPackage) {
      setPackageData(storedPackage);
    }
  }, [setPackageData]);

  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  // New state to store user data for reviews and ratings
  const [userData, setUserData] = useState([]);

  // Function to fetch user data based on user_id
  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(
        `https://localhost:3001/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Use userId as key to store user data
      setUserData((prevData) => ({
        ...prevData,
        [userId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // useEffect to fetch user data when component mounts
  useEffect(() => {
    // Check if there are reviews and ratings
    if (packageData.reviews_and_ratings) {
      // Fetch user data for each review
      packageData.reviews_and_ratings.forEach((review) => {
        fetchUserData(review.user_id);
      });
    }
  }, [packageData.reviews_and_ratings]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleReviewSubmit = async () => {
    try {
      // Check if the user has selected a rating
      if (rating === 0) {
        console.error("Please select a rating before submitting your review.");
        return;
      }

      // Prepare the review object
      const newReview = {
        review,
        ratings: rating,
      };

      // Make the POST request to add the review
      const response = await axios.post(
        `https://localhost:3001/packages/add-review/${packageData._id}`,
        newReview,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Review submitted successfully:", response.data);

      // Extract the review details from response.data
      const reviewData = response.data.reviewData;

      // Add the new review to the packageData
      const updatedPackageData = {
        ...packageData,
        reviews_and_ratings: [
          ...(packageData.reviews_and_ratings || []),
          reviewData,
        ],
      };

      // Save the updated packageData to localStorage
      localStorage.setItem(
        "selectedPackage",
        JSON.stringify(updatedPackageData)
      );

      // Clear the form after successful submission
      setRating(0);
      setReview("");

      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const {
    destination_name,
    package_name,
    package_description,
    package_time,
    location,
    price,
    remaining,
    route,
    package_cover,
    package_plan,
  } = packageData;

  const handleBookPackage = () => {
    navigate("/addBookingRequest");
  };

  return (
    <div className="w-full bg-gray-100 p-6 pb-16 md:pb-8 flex flex-col gap-4 md-2:mb-5 relative">
      <button
        className="w-fit text-white font-bold bg-blue-400 px-4 py-2 rounded-lg"
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      <div className="w-full min-h-[450px] overflow-hidden rounded-lg">
        <div
          className="bg-cover bg-center h-full"
          style={{
            backgroundImage: `url(https://localhost:3001/uploads/${package_cover})`,
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
          }}
        ></div>
      </div>

      <div className="flex justify-between items-center gap-4 mt-4">
        <div
          className={`text-lg font-bold px-4 py-2 rounded-full text-white items-center ${
            remaining > 0 ? "bg-green-400" : "bg-red-400"
          }`}
        >
          {remaining > 0 ? (
            <span className="flex items-center gap-2">
              Available <AiOutlineCheckCircle className="text-xl" />
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Unavailable <AiOutlineCloseCircle className="text-xl" />
            </span>
          )}
        </div>

        <button
          className="w-fit text-white text-xl font-bold bg-green-500 px-4 py-2 rounded-lg"
          onClick={handleBookPackage}
        >
          Book Package
        </button>
      </div>

      <div className="flex flex-col gap-8 md:items-start">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-semibold">{package_name}</h2>
            <p className="font-light">{destination_name}</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <AiOutlineDollarCircle className="text-gray-600" />
              <p className="font-medium">Price: ${price}</p>
            </div>
            <div className="flex gap-2 items-center">
              <AiOutlineEnvironment className="text-gray-600" />
              <p className="font-medium">Location: {location}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AiOutlineInfoCircle className="text-gray-600" /> Description
          </h2>
          <p>{package_description}</p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AiOutlineFieldTime className="text-gray-600" /> Route
          </h2>
          <p>{route}</p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AiOutlineClockCircle className="text-gray-600" /> Package Time
          </h2>
          <p>{new Date(package_time).toLocaleString()}</p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BsBook className="text-gray-600" /> Package Plan
          </h2>
          <p>{package_plan}</p>
        </div>
      </div>

      <div className="w-full h-[2px] bg-gray-600"></div>

      {/* Reviews and Ratings */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl text-blue-600 font-semibold">
          Reviews and Ratings
        </h2>

        {/* Display existing reviews */}
        {packageData.reviews_and_ratings &&
        packageData.reviews_and_ratings.length > 0 ? (
          <div className="flex flex-col gap-4">
            {packageData.reviews_and_ratings.map((review, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  {userData[review.user_id] && (
                    <div className="flex items-center gap-2">
                      {/* Display user photo if available, else show a default image */}
                      <img
                        src={
                          userData[review.user_id].image !== null
                            ? `https://localhost:3001/uploads/${
                                userData[review.user_id].image
                              }`
                            : "https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png"
                        }
                        alt="User"
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">
                          {userData[review.user_id].fullname}
                        </p>
                        <p className="text-gray-500">
                          @{userData[review.user_id].username}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xl ${
                          star <= review.ratings
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                      >
                        {star <= review.ratings ? (
                          <AiFillStar />
                        ) : (
                          <AiOutlineStar />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
                <p>{review.review}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet. Be the first one to review!</p>
        )}

        {/* Review Form */}
        <div className="flex flex-col gap-4 p-4 border rounded-md shadow-md bg-white">
          <h2 className="text-2xl text-blue-600 font-semibold">
            Rate and Review this Package
          </h2>

          {/* Star Rating */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl text-gray-600">Your Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRatingChange(star)}
                className={`text-xl ${
                  star <= rating ? "text-yellow-500" : "text-gray-400"
                }`}
              >
                {star <= rating ? <AiFillStar /> : <AiOutlineStar />}
              </button>
            ))}
          </div>

          {/* Review Textarea */}
          <textarea
            className="p-2 border rounded-md resize-none focus:outline-blue-500"
            placeholder="Write your review..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>

          {/* Submit Button */}
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            onClick={handleReviewSubmit}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
