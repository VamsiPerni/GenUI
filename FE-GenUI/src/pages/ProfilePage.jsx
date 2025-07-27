import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";
import { Navbar } from "../components/navbar";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MdOutlineCloudUpload } from "react-icons/md";
import { SyncLoader } from "react-spinners";

const DUMMY_IMAGE =
  "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-profile-picture-business-profile-woman-suitable-social-media-profiles-icons-screensavers-as-templatex9_719432-1351.jpg?semt=ais_hybrid&w=740";

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState({});
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const inputFileRef = useRef(null);

  const getUserDetails = async () => {
    try {
      setLoadingProfile(true);
      const resp = await axiosInstance.get("/users/details");
      setUserDetails(resp.data.data.user);
    } catch (err) {
      ErrorToast(`${err.response?.data?.message || err.message}`);
    } finally {
      setTimeout(() => setLoadingProfile(false), 1000);
    }
  };

  const handleUpdateUserDetails = (e) => {
    e.preventDefault();
    //...
  };

  const handleDPUpload = async (e) => {
    try {
      setIsImageUploading(true);
      const formData = new FormData();
      formData.append("displayPicture", e.target.files[0]);

      await axiosInstance.put("/users/display-picture", formData);
      SuccessToast("Image Uploaded!");
      getUserDetails();
    } catch (err) {
      ErrorToast(`Image upload failed: ${err.message}`);
    } finally {
      setIsImageUploading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const handleDisplayPictureContainerClick = () => {
    inputFileRef.current.click();
  };

  return (
    <div>
      <Navbar />
      <div>
        {loadingProfile ? (
          <div className="py-10 flex items-center justify-center">
            <SkeletonTheme baseColor="#808080" highlightColor="#444">
              <div className="bg-gray-200 rounded-2xl p-4 shadow-md w-full max-w-sm">
                {/* Image Placeholder */}
                <Skeleton height={180} className="rounded-xl mb-4" />

                {/* Title Placeholder */}
                <Skeleton height={20} width={`80%`} className="mb-2" />

                {/* Subtitle/Description Placeholder */}
                <Skeleton height={15} width={`60%`} className="mb-4" />

                {/* Button or Footer Placeholder */}
                <div className="flex justify-between items-center mt-4">
                  <Skeleton height={30} width={80} />
                  <Skeleton circle={true} height={30} width={30} />
                </div>
              </div>
            </SkeletonTheme>
          </div>
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-amber-50 to-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
                <h1 className="text-2xl font-bold">Profile Settings</h1>
                <p className="text-amber-100">
                  Manage your account information
                </p>
              </div>

              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center md:w-1/3">
                  <div
                    className="relative h-40 w-40 rounded-full border-4 border-amber-200 overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-all"
                    onClick={handleDisplayPictureContainerClick}
                  >
                    <img
                      src={
                        userDetails.imageUrl
                          ? userDetails.imageUrl
                          : DUMMY_IMAGE
                      }
                      className="h-full w-full object-cover"
                      alt="Profile"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      {isImageUploading ? (
                        <SyncLoader
                          color="#f59e0b"
                          size={10}
                          className="z-10"
                        />
                      ) : (
                        <MdOutlineCloudUpload className="h-12 w-12 text-amber-100" />
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    onChange={handleDPUpload}
                    className="hidden"
                    ref={inputFileRef}
                    accept="image/*"
                  />
                  <button
                    onClick={() => inputFileRef.current.click()}
                    className="mt-4 px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors text-sm font-medium"
                  >
                    Change Photo
                  </button>
                </div>

                {/* Form Section */}
                <form
                  className="flex-1 space-y-6"
                  onSubmit={handleUpdateUserDetails}
                >
                  {/* Email (disabled) */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      defaultValue={userDetails.email}
                      type="email"
                      name="email"
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Role Badge */}
                  <div className="inline-block px-3 py-1 rounded-full bg-lime-100 text-lime-800 text-sm font-medium">
                    {userDetails.role}
                  </div>

                  {/* Name */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={userDetails.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      name="gender"
                      defaultValue={userDetails.gender || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full md:w-auto px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors font-medium shadow-md"
                    >
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        <div></div>
      </div>
    </div>
  );
};

export { ProfilePage };
