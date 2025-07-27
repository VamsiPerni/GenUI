import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";
import { Navbar } from "../components/navbar";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MdOutlineCloudUpload } from "react-icons/md";
import { SyncLoader } from "react-spinners";
import { Footer } from "../components/footer";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f0f4f8] to-[#e2e8f0]">
      <Navbar />
      {loadingProfile ? (
        <div className="py-10 flex items-center justify-center">
          <SkeletonTheme baseColor="#d1d5db" highlightColor="#f3f4f6">
            <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-sm">
              <Skeleton height={180} className="rounded-xl mb-4" />
              <Skeleton height={20} width="70%" className="mb-3" />
              <Skeleton height={15} width="50%" className="mb-4" />
              <div className="flex justify-between items-center mt-4">
                <Skeleton height={35} width={100} />
                <Skeleton circle={true} height={35} width={35} />
              </div>
            </div>
          </SkeletonTheme>
        </div>
      ) : (
        <div className="flex-grow py-8 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
              <h1 className="text-2xl font-bold">Profile Settings</h1>
              <p className="text-indigo-200">Manage your account info</p>
            </div>
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center md:w-1/3">
                <div
                  onClick={handleDisplayPictureContainerClick}
                  className="relative h-40 w-40 rounded-full border-4 border-indigo-200 overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <img
                    src={userDetails.imageUrl || "/default-avatar.png"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    {isImageUploading ? (
                      <SyncLoader color="#fbbf24" size={10} />
                    ) : (
                      <MdOutlineCloudUpload className="h-12 w-12 text-yellow-100" />
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDPUpload}
                  className="hidden"
                  ref={inputFileRef}
                />
                <button
                  onClick={() => inputFileRef.current.click()}
                  className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 transition"
                >
                  Change Photo
                </button>
              </div>
              <form
                onSubmit={handleUpdateUserDetails}
                className="flex-1 space-y-6"
              >
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={userDetails.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md cursor-not-allowed"
                  />
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  {userDetails.role}
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    name="name"
                    defaultValue={userDetails.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    defaultValue={userDetails.gender || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-200"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-md transition"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export { ProfilePage };
