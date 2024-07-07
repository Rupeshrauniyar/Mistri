const ProfilePicture = document.querySelector("#ProfilePicture");
ProfilePicture.addEventListener("change", function (e) {
  const image = e.target.files[0];
  console.log(image);
  if (image) {
    const ProfileReader = new FileReader();
    ProfileReader.onload = function (event) {
      const DisplayProfilePic = document.querySelector("#DisplayProfilePic");
      DisplayProfilePic.src = event.target.result;
      console.log(event.target.result);
    };
    ProfileReader.readAsDataURL(image);
  }
});
