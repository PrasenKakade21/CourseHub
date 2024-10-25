// const ignorePaths = ["/contactus","/aboutus"];

async function PurchaseCourse(courseId) {
  const body = JSON.stringify({
    courseId: courseId,
  });

  try {
    const response = await fetch("http://localhost:3000/course/purchase", {
      method: "POST",
      body: body,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (response.status === 201) {
      const result = await response.json();
      if(confirm("Course purchased successfully!")){
        document.location.reload();
      }
      else{
        document.location.reload()
      }
      console.log(result);
    } 
    else if(response.status === 208) {
      const result = await response.json();
      alert("Course already Purchased");
      console.log(result);
    } 
    else {
      console.error("Error purchasing course:", response.statusText);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}

async function SignUp(username, phone, email, password, usertype) {
  const body = JSON.stringify({
    username: username,
    phone: phone,
    email: email,
    password: password,
  });
  console.log(body);
  try {
    const response = await fetch(`http://localhost:3000/${usertype}/signup`, {
      method: "POST",
      body: body,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (response.ok) {
      const result = await response.json();
      alert("Signed up successfully!");
      console.log(result);
      return true;
    } else {
      console.error("Error Signing up:", response.statusText);
    }
  } catch (error) {
    console.error("Request failed:", error);
    return;
  }
}

async function Login(email, password, usertype) {
  const body = JSON.stringify({
    email: email,
    password: password,
  });
  try {
    const response = await fetch(`http://localhost:3000/${usertype}/login`, {
      method: "POST",
      body: body,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (response.ok) {
      alert("Login successfully!");
      return true;
    } else {
      console.error("Error Login:", response.statusText);
      alert("Login Failed");
    }
  } catch (error) {
    console.error("Request failed:", error);
    return;
  }
}

function getCookie(name) {
  var dc = document.cookie;
  console.log(dc)
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
      end = dc.length;
    }
  }

  return decodeURI(dc.substring(begin + prefix.length, end));
}

function checkLoginStatus() {

//   const pathname = window.location.pathname
// if(ignorePaths.includes(pathname)){
//   console.log("ignored");
  
//   return;
// }
  // console.log(pathname)
  const token = getCookie("token");
  const usertype = getCookie("usertype");
  console.log("log form functions 123" , token,usertype)
  const loginhide = document.getElementsByClassName("loginhide");
  const loginshow = document.getElementsByClassName("loginshow");
  const userhide = document.getElementsByClassName("userhide");

  if (token) {
    Array.from(loginhide).forEach((element) => {
      element.classList.add("hidden");
    });
    Array.from(loginshow).forEach((element) => {
      element.classList.remove("hidden");
    });
  } else {
    Array.from(loginhide).forEach((element) => {
      element.classList.remove("hidden");
    });

    Array.from(loginshow).forEach((element) => {
      element.classList.add("hidden");
    });
  }

  if (usertype == 'user') {
    Array.from(userhide).forEach((element) => {
      element.classList.add("hidden");
    });
  } else {
    Array.from(userhide).forEach((element) => {
      element.classList.remove("hidden");
    });
  }
  if(token){
    return true;
  }
  else{
    return false;
  }
  
}

function logout() {
  console.log(document.cookie);
  
  document.cookie = "token" +'=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;domain=localhost;';
;
  document.cookie = "usertype" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;domain=localhost;';
;
  console.log(document.cookie);

  window.location.href = "http://localhost:3000/";
}

async function AddCourse() {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const content = document
    .getElementById("content")
    .value.split(",")
    .map((item) => item.trim()); // Split by commas and trim spaces
  const price = parseFloat(document.getElementById("price").value);
  const imageUrl = document.getElementById("imageUrl").value;

  const courseData = {
    title,
    description,
    content, 
    price,
    imageUrl,
  };
  try {
    // Send data to the server

    const response = await fetch("http://localhost:3000/course/make", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Success:", data);
      // let person = prompt("Course created successfully!");
      if(confirm("Course created successfully!")){
       document.getElementById("create-course-form").reset();
      }
    } 
    else {
      console.error("Error Login:", response.statusText);
    }

  } catch (error) {
    console.error("Error:", error);
    alert("There was a problem creating the course: " + error.message);
  }
}

async function ContactMessage() {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value.trim();


  const messageData = {
    name,
    email,
    message
  };
  try {

    const response = await fetch("http://localhost:3000/contact/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Success:", data);
      alert("Message Sent!");

    } 
    else {
      console.error("Error sending:", response.statusText);
      if(response.status == 429){
        alert("Please Wait for a while before sending another message");
      }else{

        alert("Error:", data);
      }

    }

  } catch (error) {
    console.error("Error:", error);
    alert("There was a problem sending message: " + error.message);
  }
}


async function updateProfile() {
  
  const updatedName = editNameField.value;
  const updatedEmail = editEmailField.value;
  const updatedPhone = editPhoneField.value;

  const data = {
    username : updatedName,
    email : updatedEmail,
    phone : updatedPhone
  }
  console.log(JSON.stringify(data));

  try {

    const response = await fetch("http://localhost:3000/profile?isedit=true", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Success:", data);
      alert("Profile Edited Succcessfully!")
    } 
    else {
      console.error("Error editing:", response.statusText);
    }

  } catch (error) {
    console.error("Error:", error);
    alert("There was a problem editing profile: " + error.message);
  }


  nameField.value = updatedName;
  emailField.value = updatedEmail;
  phoneField.value = updatedPhone;

}


async function updatePassword() {
  

      const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword === confirmPassword) {
          const data = {
            currentpassword:currentPassword,
            newpassword: newPassword
          }
        
          try {
        
            const response = await fetch("http://localhost:3000/profile?ispass=true", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });
        
            if (response.ok) {
              const data = await response.json();
              console.log("Success:", data);
              alert('Password changed successfully!');
            } 
            else {
              console.error("Error editing:", response.statusText);
            }
        
          } catch (error) {
            console.error("Error:", error);
            alert("There was a problem editing password: " + error.message);
          }
        
        
            passwordPanel.classList.add('hidden');
            profilePanel.classList.remove('hidden');
        } else {
            alert('New passwords do not match!');
        }

}