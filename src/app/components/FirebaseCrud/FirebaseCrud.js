"use client";
import FirebaseConfig from "../FirebaseConfig/FirebaseConfig";
import {
  ref,
  set,
  update,
  remove,
  child,
  get,
  getDatabase,
} from "firebase/database";
import { useState } from "react";
import "./FirebaseCrud.css";

const database = FirebaseConfig();

export default function FirebaseCrud() {
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [sensorDetect, setsensorDetect] = useState("");
  let [unlockDoor, setUnlockDoor] = useState("");

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
            password: password,
            sensorDetect: sensorDetect,
            unlockDoorFunc: unlockDoor,
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
    const dbref = ref(database);

    if (
      isNullOrWhiteSpaces(username) ||
      isNullOrWhiteSpaces(password) ||
      isNullOrWhiteSpaces(sensorDetect) ||
      isNullOrWhiteSpaces(unlockDoor)
    ) {
      alert("fill all the fields");
      return;
    }

    set(ref(database, "/Customer/" + username), {
      password: password,
      sensorDetect: sensorDetect,
      unlockDoorFunc: unlockDoor,
    });
  };

  let SelectData = () => {
    const dbref = ref(database);

    get(child(dbref, "Customer/" + username))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setPassword(snapshot.val().password);
          setsensorDetect(snapshot.val().sensorDetect);
          setUnlockDoor(snapshot.val().unlockDoorFunc);
        } else {
          alert("no data available");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("select: error data retrieval was unsuccessful");
      });
  };
  let RefreshData = () => {
    const dbref = ref(database);

    if (isNullOrWhiteSpaces(username)) {
      alert("Username is required to get data");
      return;
    }

    get(child(dbref, "/Customer/" + username))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setPassword(snapshot.val().password);
          setsensorDetect(snapshot.val().sensorDetect);
          setUnlockDoor(snapshot.val().unlockDoorFunc);
          let tmppass = snapshot.val().password;
          let tmpsensorDetect = snapshot.val().sensorDetect;
          let x;
          if (tmpsensorDetect >= 1) {
            x = "YES";
          } else x = "NO";
          let tmpunlockdoor = snapshot.val().unlockDoorFunc;

          alert(
            "Current Status is:\n password: " +
              tmppass +
              "\n" +
              "is sensor detecting something" +
              x
          );
        } else {
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

      <label>Password</label>
      <input
        type="text"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <br />

      <label>sensorDetect</label>
      <input
        type="text"
        value={sensorDetect}
        onChange={(e) => {
          setsensorDetect(e.target.value);
        }}
      />
      <br />

      <label>Unlock Door (0/1)</label>
      <input
        type="text"
        value={unlockDoor}
        onChange={(e) => {
          setUnlockDoor(e.target.value);
        }}
      />
      <br />

      <button onClick={InsertData}>Insert data</button>
      <button onClick={UpdateData}>Update data</button>
      <button onClick={DeleteData}>Delete data</button>
      <button onClick={SelectData}>Select data</button>
      <button onClick={RefreshData}>Refresh data</button>
    </>
  );
}
