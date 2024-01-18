import axios from "axios";
import { useEffect, useState } from "react";
import { IoSettings } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function Profile() {

    const [profile, setProfile] = useState()

    async function fetchProfile() {
        try {
            let {data} = await axios({
                url: "http://localhost:3000/profile",
                method: "get",
                headers: {
                    Authorization: localStorage.getItem('access_token')
                }
            })

            setProfile(data);

        } catch (error) {

            console.log(error);

        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

  return (
    <>
      {/* component */}
      <div className="flex h-screen antialiased text-gray-800">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
            <div className="flex flex-row items-center justify-center h-12 w-full">
              <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div className="ml-2 font-bold text-2xl">QuickChat</div>
            </div>
            <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
              <div className="flex w-full place-content-end">
                <button>
                  <IoSettings className="size-6" />
                </button>
              </div>
              <div className="h-20 w-20 rounded-full border overflow-hidden">
                <img
                  src="https://pbs.twimg.com/profile_images/1228666363939606529/cFZCx2CB_400x400.jpg"
                  alt="Avatar"
                  className="h-full w-full"
                />
              </div>
              <div className="text-sm font-semibold mt-2">
                {profile && profile.fullName}
              </div>
              <div className="text-xs text-gray-500">Lead UI/UX Designer</div>
              <div className="flex flex-row items-center mt-3">
                <button
                  className="middle none center rounded-lg bg-red-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  data-ripple-light="true"
                  onClick={() => {
                    auth.signOut();
                    localStorage.clear();
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-auto h-full p-6">
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4 items-center justify-center">
              <form className="w-3/5">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Full Name</span>
                  </div>
                  <input
                    type="text"
                    placeholder={profile && profile.fullName}
                    className="input input-bordered w-full "
                    disabled
                  />
                </label>
                <label className="form-control w-full ">
                  <div className="label">
                    <span className="label-text">E-Mail</span>
                  </div>
                  <input
                    type="text"
                    placeholder={profile && profile.email}
                    className="input input-bordered w-full "
                    disabled
                  />
                </label>
                <label className="form-control w-full ">
                  <div className="label">
                    <span className="label-text">Username</span>
                  </div>
                  <input
                    type="text"
                    placeholder=""
                    className="input input-bordered w-full "
                  />
                </label>
                <label className="form-control w-full ">
                  <div className="label">
                    <span className="label-text">Gender</span>
                  </div>
                  <input
                    type="text"
                    placeholder=""
                    className="input input-bordered w-full "
                  />
                </label>
                <label className="form-control w-full ">
                  <div className="label">
                    <span className="label-text">Age</span>
                  </div>
                  <input
                    type="text"
                    placeholder=""
                    className="input input-bordered w-full "
                  />
                </label>
                <label className="form-control w-full ">
                  <div className="label">
                    <span className="label-text">Pick a file</span>
                  </div>
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full "
                  />
                </label>
                <div >
                    <br />
                <button className="btn btn-accent mr-3">Update Profile</button>
                  <Link to="/" className="btn btn-warning">Cancel</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
