"use client";

import { useRouter } from "next/navigation";
import OptionRow from "./OptionRow";

export default function WelcomeCard() {
  const router = useRouter();

  return (
    <section className="main-card-signarea p-8">
      <div className="text-center mb-6">
        <h2 className="title-primary">Let’s get started!</h2>
        <p className="title-secondary">Welcome to PCAS</p>
        <p className="description-text">
          The Pakistan Centralized Admission System.
          <br /><br />
          Create your student account to begin the application process for undergraduate and graduate programs.
        </p>
      </div>

      <p className="text-gray-600 text-sm text-center mb-6">
        Already have an account?
        <a href="/Login" className="link-primary ml-1">Go to the login page</a>
      </p>

      <div className="option-group">
        <OptionRow
          label="Create Student Account"
          note="For both undergraduate and graduate programs · انڈرگریجویٹ اور گریجویٹ پروگرام"
          onClick={() => router.push("/register/accountcreation")}
        />
      </div>
    </section>
  );
}
