import OptionRow from "./OptionRow";

export default function WelcomeCard() {
  return (
    <section className="main-card p-8">
      <div className="text-center mb-6">
        <h2 className="title-primary">Let’s get started!</h2>
        <p className="title-secondary">Welcome to PUCAS</p>
        <p className="description-text">
          Welcome to the Pakistan University Centralized Admission System (PUCAS).
          <br />
          Please select your application type to begin the registration process.
        </p>
      </div>

      <p className="text-gray-600 text-sm text-center mb-6">
        Already have an account?
        <a href="#" className="link-primary ml-1">Go to the login page</a>
      </p>

      <div className="option-group">
        <OptionRow
          label="First-year student"
          note="Undergraduate · داخلہ برائے انڈرگریجویٹ"
          // onClick={() => router.push("/register/first-year")}
        />
        <OptionRow
          label="Graduate student"
          note="Masters/Doctorate · گریجویٹ پروگرام"
          // onClick={() => router.push("/register/graduate")}
        />
      </div>
    </section>
  );
}
