import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";

const BACKENDURL = import.meta.env.VITE_BACKENDURL;

export default function AdminRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    hospital_name: "",
    hospital_email: "",
    hospital_password: "",
    hospital_phno: "",

    hospital_logo: null,
  });

  const [errors, setErrors] = useState({});

  // Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usPhoneRegex =
    /^(\+1)?\s?\(?[2-9][0-9]{2}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;

  const validate = () => {
    const newErrors = {};

    if (!form.hospital_name.trim()) {
      newErrors.hospital_name = "Hospital name is required";
    }

    if (!emailRegex.test(form.hospital_email)) {
      newErrors.hospital_email = "Invalid email format";
    }

    if (form.hospital_password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!usPhoneRegex.test(form.hospital_phno)) {
      newErrors.hospital_phno = "Enter a valid US phone number";
    }

    if (!form.hospital_logo) {
      newErrors.hospital_logo = "Hospital logo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value,
    });
  };
  const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  const formData = new FormData();

  formData.append("hospital_name", form.hospital_name);
  formData.append("hospital_email", form.hospital_email);
  formData.append("hospital_password", form.hospital_password);
  formData.append("hospital_phno", form.hospital_phno);

  // ✅ Convert logo to Base64

   const base64Logo = await fileToBase64(form.hospital_logo);

// REMOVE data:image/...;base64,
const pureBase64 = base64Logo.split(",")[1];


const normalizedPhone = form.hospital_phno.replace(/\D/g, "");
formData.append("hospital_phno", normalizedPhone);

formData.append("hospital_logo", pureBase64);

const payload = {
  hospital_name: form.hospital_name,
  hospital_email: form.hospital_email,
  hospital_password: form.hospital_password,
  hospital_phno: normalizedPhone,
  hospital_logo: pureBase64, // base64 string only
};

  


    try {
      const res = await fetch(`${BACKENDURL}/api/auth/signup`, {
         method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       
        body: JSON.stringify(payload),
      });
      if (res.status === 409) {
        alert("Email already exists!");
         throw new Error("Email already exists");
        return
       
        ;

      }
      if (res.status === 401) {
         alert("Invalid input data!"+res.message);
        throw new Error("Invalid input data");
       
        return; 
      }
      if (!res.ok) 
        {
          throw new Error("Registration failed")
          alert("Registration failed!")
          return;
        }else{
        alert("Registration successful!");
        navigate("/admin/login", { replace: true });
        }

      
    } catch (err) {
      alert(err.message);
    }
 

};


  return (
    <div className="login-page">
      <h1 className="brand">Patienttalkback.com</h1>
      <div className="star">★</div>

      <form className="login-card" onSubmit={handleSubmit}>
        <label>Hospital Name</label>
        <input
          type="text"
          name="hospital_name"
          placeholder="Enter hospital name"
          value={form.hospital_name}
          onChange={handleChange}
        />
        {errors.hospital_name && <p className="error">{errors.hospital_name}</p>}

        <label>Hospital Logo</label>
        <input type="file" name="hospital_logo" accept="image/*" onChange={handleChange} />
        {errors.hospital_logo && <p className="error">{errors.hospital_logo}</p>}
        <label>Email</label>
        <input
          type="email"
          name="hospital_email"
          placeholder="Email"
          value={form.hospital_email}
          onChange={handleChange}
        />
        {errors.hospital_email && <p className="error">{errors.hospital_email}</p>}

        <label>Password</label>
        <input
          type="password"
          name="hospital_password"
          placeholder="Password"
          value={form.hospital_password}
          onChange={handleChange}
        />
        {errors.hospital_password && <p className="error">{errors.hospital_password}</p>}

        <label>Phone Number</label>
        <input
          type="tel"
          name="hospital_phno"
          placeholder="US Phone Number"
          value={form.hospital_phno}
          onChange={handleChange}
        />
        {errors.hospital_phno && <p className="error">{errors.hospital_phno}</p>}

        

        <button className="login-btn" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
