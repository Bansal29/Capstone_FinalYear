import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Navbar = styled.nav`
  &.sample {
    background: rgba(255, 255, 255, 0.015);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(6px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  &.scrolled {
    background: rgba(255, 255, 255, 0.9);
  }
`;

const NavbarBrand = styled(Link)`
  display: flex;
  align-items: center;
  img {
    margin-right: 8px;
  }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
`;

const UserInfoSection = styled.section`
  .user-info {
    .container {
      border-radius: 8px;
      margin-top: 50px;
      margin-bottom: 50px;
      background-color: white;
    }
  }
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  margin-top: 30px;
`;

const InputFile = styled.input`
  display: none;
`;

const UpdateImageButton = styled.button`
  cursor: pointer;
  margin-top: 20px;
  width: 40%;
`;

const ProfileSettingsContainer = styled.div`
  padding: 20px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const SaveButton = styled.button`
  margin-top: 20px;
  width: 100%;
`;

const UserProfile = () => {
  const profilePicRef = useRef(null);
  const inputFileRef = useRef(null);

  // State for form fields
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include authorization header if required (e.g., token)
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setName(data.name);
        setSurname(data.surname);
        setMobileNumber(data.mobileNumber);
        setEmail(data.email);
        setAge(data.age);
        // Set password if it’s okay to autofill (not recommended for security reasons)
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = () => {
    if (inputFileRef.current.files[0]) {
      profilePicRef.current.src = URL.createObjectURL(
        inputFileRef.current.files[0]
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const profileData = {
      name,
      surname,
      mobileNumber,
      email,
      age,
    };

    try {
      const response = await fetch("http://localhost:5000/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await response.json();
      console.log("Profile updated successfully:", result);

      // Reset fields after submission (optional)
      setName("");
      setSurname("");
      setMobileNumber("");
      setEmail("");
      setAge("");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <UserInfoSection className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-md-4 border-right">
              <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                <ProfileImage
                  ref={profilePicRef}
                  width="350px"
                  src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                  alt="Profile"
                />
                <UpdateImageButton
                  className="btn btn-primary"
                  type="button"
                  onClick={() => inputFileRef.current.click()}
                >
                  Update Image
                </UpdateImageButton>
                <InputFile
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  id="input-file"
                  ref={inputFileRef}
                  onChange={handleImageChange}
                />
                <span className="font-weight-bold text-black-100">{email}</span>
                <span></span>
              </div>
            </div>
            <div className="col-md-7 border-right">
              <ProfileSettingsContainer>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="text-right">Profile Settings</h4>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row mt-2">
                    <div className="col-md-6">
                      <Label>Name</Label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="First name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <Label>Surname</Label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-12">
                      <Label>Mobile Number</Label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Enter phone number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-12">
                      <Label>Email</Label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter Email Id"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-md-12">
                      <Label>Age</Label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <SaveButton
                      className="btn btn-primary"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Profile"}
                    </SaveButton>
                    {error && <div className="text-danger mt-2">{error}</div>}
                  </div>
                </form>
              </ProfileSettingsContainer>
            </div>
          </div>
        </div>
      </UserInfoSection>
    </div>
  );
};

export default UserProfile;
