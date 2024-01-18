import axios from "axios";
import { useEffect, useState } from "react";
import { IoSettings } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineUserDelete } from "react-icons/ai";

export default function Profile() {

    const navigate = useNavigate()

    const [profile, setProfile] = useState()
    const [editProfile, setEditProfile] = useState()
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        username: "",
        gender: "",
        age: 0,
    })
    const [file, setFile] = useState(null)

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
            setEditProfile(data.Profile)
            setForm({
                ...form,
                fullName: data.fullName,
                email: data.email,
                username: data.Profile.username,
                gender: data.Profile.gender,
                age: data.Profile.age,
                imgUrl: data.Profile.imgUrl
            })

        } catch (error) {

            console.log(error);

        }
    }

    const onChangeHandler = async (event) => {
        try {
            // console.log(event);
            let {name, value} = event.target
            setForm({...form, [name]: value})
        } catch (error) {
            
        }
    }

    const onChangeFile = (event) => {
        // console.log(event.target.files[0]);
        setFile(event.target.files[0])
    }

    const submitHandler = async (event) => {
        try {

            event.preventDefault();

            console.log(form, `==form==`)

            let responseForm = await axios({
                url: 'http://localhost:3000/profile/' + editProfile.id,
                method: "put",
                data: form,
                headers: {
                    Authorization: localStorage.getItem("access_token")
                }
            })


            if(file) {
                console.log('masuk ke file')
                let formData = new FormData()
                formData.append('imgUrl', file)
                let responseFile = await axios({
                    url: 'http://localhost:3000/profile/' + editProfile.id,
                    method: "patch",
                    data: formData,
                    headers: {
                        Authorization: localStorage.getItem("access_token")
                    }
                })
                console.log(responseFile)
                navigate("/")
            } else {
                console.log("gaada file")
            }


        } catch (error) {
            console.log(error)
        }
    }

    const deleteHandler = async () => {
        try {
            let response = await axios ({
                url: "http://localhost:3000/profile/" + profile.id,
                method: "delete",
                headers: {
                    Authorization: localStorage.getItem("access_token")
                }
            })

            localStorage.clear();
            navigate('/login')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    console.log(profile);

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
              <div className="flex w-full justify-between">
                <button onClick={deleteHandler}>
                <AiOutlineUserDelete className="size-6" />
                </button>
                <button>
                  <IoSettings className="size-6" />
                </button>
              </div>
              <div className="h-20 w-20 rounded-full border overflow-hidden">
                <img
                  src={editProfile && editProfile.imgUrl}
                  alt="Avatar"
                  className="h-full w-full"
                />
              </div>
              <div className="text-sm font-semibold mt-2">
                {profile && profile.fullName}
              </div>
              {/* <div className="text-xs text-gray-500">Lead UI/UX Designer</div> */}
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
              <form className="w-3/5" onSubmit={submitHandler}>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Full Name</span>
                  </div>
                  <input
                    type="text"
                    placeholder={profile && profile.fullName}
                    className="input input-bordered w-full "
                    disabled
                    value={form.fullName}
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
                    name="username"
                    placeholder={editProfile && editProfile.username}
                    className="input input-bordered w-full "
                    disabled={
                      editProfile && editProfile.username ? true : false
                    }
                    onChange={onChangeHandler}
                    value={form.username}
                  />
                </label>
                <label className="form-control w-full ">
                  <div className="label">
                    <span className="label-text">Gender</span>
                  </div>
                  <input
                    name="gender"
                    type="text"
                    placeholder={editProfile && editProfile.gender}
                    className="input input-bordered w-full "
                    disabled={editProfile && editProfile.gender ? true : false}
                    onChange={onChangeHandler}
                    value={form.gender}
                  />
                </label>
                <label className="form-control w-full ">
                  <div className="label">
                    <span className="label-text">Age</span>
                  </div>
                  <input
                    name="age"
                    type="number"
                    placeholder={editProfile && editProfile.age}
                    className="input input-bordered w-full "
                    value={editProfile && editProfile.age ? null : null}
                    onChange={onChangeHandler}
                    disabled={editProfile && editProfile.age > 0 ? true : false}
                  />
                </label>
                <label className="form-control w-full ">
                  <div className="label">
                    <span className="label-text">Pick a file</span>
                  </div>
                  <input
                    name="imgUrl"
                    type="file"
                    className="file-input file-input-bordered w-full "
                    onChange={onChangeFile}
                  />
                </label>
                <br />
                <div className="flex justify-between">
                  <div>
                    <button className="btn btn-accent mr-3">
                      Update Profile
                    </button>
                    <Link to="/" className="btn btn-warning">
                      Cancel
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
