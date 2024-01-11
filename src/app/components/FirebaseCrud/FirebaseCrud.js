"use client";
import FirebaseConfig from "../FirebaseConfig/FirebaseConfig";
import { ref, set, update, remove, child } from "firebase/database";
import { useState } from "react";
import "./FirebaseCrud.css";

const database = FirebaseConfig();

export default function FirebaseCrud() {
  let [username, setUsername] = useState("");
  let [fullname, setFullName] = useState("");
  let [phone, setPhone] = useState("");
  let [dob, setDob] = useState("");

  let isNullOrWhiteSpaces = (value) => {
    value = value.toString();
    return (value == null || value.replaceAll(" ", " ")).length < 1;
  };

  let UpdateData = () => {
    const dbref = ref(database);

    if (isNullOrWhiteSpaces(username)) {
      alert(
        "username is empty, try to select a user first, with the select button"
      );
      return;
    }
    get(child(dbref, "Customer/" + username))
      .then((snapshot) => {
        if (snapshot.exists()) {
          update(ref(database, "/Customer/" + username), {
            fullname: fullname,
            phonenumber: phone,
            dateofbirth: dob,
          })
            .then(() => {
              alert("customer updated successfully");
            })
            .catch((error) => {
              console.log(error);
              alert("there was an error updating the customer");
            });
        } else {
          alert("error : the user does exist");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("error data retrieval was unsuccessful");
      });
  };

  let DeleteData = () => {
    const dbref = ref(database);

    if (isNullOrWhiteSpaces(username)) {
      alert("username is required ro delete a user");
      return;
    }

    get(child(dbref, "Customer/" + username)).then((snapshot) => {
      if (snapshot.exists()) {
        remove(ref(database, "Customer/" + username))
          .then(() => {
            alert("customer deleted successfully");
          })
          .catch((error) => {
            console.log(error);
            alert("there was an error deleting the customer");
          });
      } else {
        alert("error : the user does exist");
      }
    });
  };

  let InsertData = () => {
    // const dbref = ref(database);

    if (
      isNullOrWhiteSpaces(username) ||
      isNullOrWhiteSpaces(fullname) ||
      isNullOrWhiteSpaces(phone) ||
      isNullOrWhiteSpaces(dob)
    ) {
      alert("fill all the fields");
      return;
    }

    set(ref(database, "/Customer/" + username), {
      fullname: fullname,
      phonenumber: phone,
      dateofbirth: dob,
    });
  };

  let SelectData = () => {
    const dbref = ref(database);

    get(child(dbref, "Customer/" + username))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setFullName(snapshot.val().fullname);
          setPhone(snapshot.val().phonenumber);
          setDob(snapshot.val().dateofbirth);
        } else {
          alert("no data available");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("select: error data retrieval was unsuccessful");
      });
  };

  return (
    <>
      <label>Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <br />

      <label>Full Name</label>
      <input
        type="text"
        value={fullname}
        onChange={(e) => {
          setFullName(e.target.value);
        }}
      />
      <br />

      <label>Phone Number</label>
      <input
        type="text"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
        }}
      />
      <br />

      <label>Date of Birth</label>
      <input
        type="text"
        value={dob}
        onChange={(e) => {
          setDob(e.target.value);
        }}
      />
      <br />

      <button onClick={InsertData}>Insert data</button>
      <button onClick={UpdateData}>Update data</button>
      <button onClick={DeleteData}>Delete data</button>
      <button onClick={SelectData}>Select data</button>
    </>
  );
}
