import React from "react";

export default function Contact() {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "30564edc-a362-416a-8b31-d8d8932b7089");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <section className="contact" id="contact">
      <h2>Contact Us</h2>
      <form className="contact-form" onSubmit={onSubmit}>
        <input type="text" name="name" placeholder="Your Name" required />
        <input type="email" name="email" placeholder="Your Email" required />
        <textarea name="message" placeholder="Your Message" required></textarea>
        <button type="submit">Send Inquiry</button>
      </form>
      <span style={{ color: "#fff", marginTop: 10 }}>{result}</span>
      <div className="contact-info">
        <p>Email: Pesante001@outlook.com</p>
        <p>WhatsApp / Office: +254 722 899 340</p>
        <p>OR</p>
        <p>WhatApp / Office:+254723503372</p>


        <
      </div>
    </section>
  );
} 