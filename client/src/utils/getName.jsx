import Swal from "sweetalert2";

export async function getName() {
    const result = await Swal.fire({
      title: "Enter your Name",
      input: "text",
      inputLabel: "",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Name Cannot Be Left Empty!!";
        }
      },
    });
    return result;
  }