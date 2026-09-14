import { GoogleLogin } from "@react-oauth/google";
import { Sparkles } from "lucide-react";

function Login() {
  // ==========================================
  // GOOGLE LOGIN SUCCESS
  // ==========================================

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("Google login successful");

      const backendResponse = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/google`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            credential: credentialResponse.credential,
          }),
        }
      );

      if (!backendResponse.ok) {
        throw new Error("Failed to authenticate with backend");
      }

      const backendUser = await backendResponse.json();

      // Save backend authentication token
      localStorage.setItem("authToken", backendUser.token);

      // Save username
      if (backendUser.user) {
        localStorage.setItem(
          "username",
          backendUser.user.name ||
            backendUser.user.email ||
            "User"
        );

        // Save email if available
        if (backendUser.user.email) {
          localStorage.setItem(
            "userEmail",
            backendUser.user.email
          );
        }
      }

      console.log("User successfully logged in");

      // Reload website
      window.location.reload();
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  // ==========================================
  // GOOGLE LOGIN ERROR
  // ==========================================

  const handleGoogleError = () => {
    console.log("Google Login Failed");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020817] flex items-center justify-center">

      {/* ==========================================
          ANIMATED BACKGROUND
      ========================================== */}

      {/* Moving grid */}

      <div
        className="
          absolute inset-0
          opacity-30
          animate-grid
          bg-[linear-gradient(rgba(0,180,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(0,180,255,0.12)_1px,transparent_1px)]
          bg-[size:45px_45px]
        "
      />

      {/* Large blue glow */}

      <div
        className="
          absolute
          -top-40
          -left-40
          w-[500px]
          h-[500px]
          rounded-full
          bg-blue-600/20
          blur-[140px]
          animate-glow
        "
      />

      {/* Large cyan glow */}

      <div
        className="
          absolute
          -bottom-40
          -right-40
          w-[550px]
          h-[550px]
          rounded-full
          bg-cyan-500/15
          blur-[150px]
          animate-glow-slow
        "
      />

      {/* Center glow */}

      <div
        className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[500px]
          h-[500px]
          rounded-full
          bg-blue-500/10
          blur-[130px]
        "
      />

      {/* ==========================================
          FLOATING PARTICLES
      ========================================== */}

      <span className="particle particle-1" />
      <span className="particle particle-2" />
      <span className="particle particle-3" />
      <span className="particle particle-4" />
      <span className="particle particle-5" />
      <span className="particle particle-6" />

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <div className="relative z-10 w-full max-w-[720px] px-5 py-10">

        {/* ==========================================
            TERRIFIC LOGO
        ========================================== */}

        <div className="flex flex-col items-center text-center mb-8">

          {/* Logo container */}

          <div className="relative w-32 h-32 flex items-center justify-center mb-5">

            {/* Outer rotating glow */}

            <div
              className="
                absolute
                inset-0
                rounded-full
                border
                border-blue-400/20
                animate-spin-slow
              "
            />

            {/* Outer glowing ring */}

            <div
              className="
                absolute
                w-28
                h-28
                rounded-full
                border-2
                border-blue-400/40
                shadow-[0_0_25px_rgba(0,140,255,0.5)]
                animate-logo-pulse
              "
            />

            {/* Rotating cyan ring */}

            <div
              className="
                absolute
                w-20
                h-20
                rounded-full
                border-2
                border-cyan-300
                border-t-transparent
                shadow-[0_0_25px_rgba(0,220,255,0.8)]
                animate-spin-reverse
              "
            />

            {/* Inner circle */}

            <div
              className="
                relative
                w-14
                h-14
                rounded-full
                bg-[#031b35]
                border
                border-cyan-300
                flex
                items-center
                justify-center
                shadow-[0_0_25px_rgba(0,220,255,0.8)]
                animate-icon-container
              "
            >

              {/* Animated icon */}

              <Sparkles
                size={28}
                strokeWidth={2}
                className="
                  text-cyan-300
                  drop-shadow-[0_0_10px_rgba(34,211,238,1)]
                  animate-icon
                "
              />

            </div>

            {/* Small glowing dot */}

            <span
              className="
                absolute
                right-1
                top-5
                w-3
                h-3
                rounded-full
                bg-cyan-300
                shadow-[0_0_20px_#22d3ee]
                animate-dot
              "
            />

          </div>

          {/* ==========================================
              PERSONAL INTELLIGENCE SYSTEM
          ========================================== */}

          <p
            className="
              text-cyan-300
              text-xs
              sm:text-sm
              font-bold
              tracking-[5px]
              mb-3
              animate-text-glow
            "
          >
            PERSONAL INTELLIGENCE SYSTEM
          </p>

          {/* ==========================================
              TERRIFIC
          ========================================== */}

          <h1
            className="
              text-5xl
              sm:text-6xl
              font-black
              tracking-wide
              text-white
              drop-shadow-[0_0_25px_rgba(0,180,255,0.5)]
            "
          >
            TERRIFIC
          </h1>

          {/* ==========================================
              DESCRIPTION
          ========================================== */}

          <p
            className="
              mt-4
              max-w-[520px]
              text-sm
              sm:text-base
              leading-7
              text-blue-200
            "
          >
            Your personal AI assistant for coding, productivity,
            <br className="hidden sm:block" />
            ideas and more.
          </p>

        </div>

        {/* ==========================================
            LOGIN CARD
        ========================================== */}

        <div
          className="
            relative
            w-full
            p-7
            sm:p-9
            rounded-3xl
            border
            border-cyan-400/40
            bg-blue-950/60
            backdrop-blur-xl
            shadow-[0_0_50px_rgba(0,140,255,0.25)]
            animate-card
          "
        >

          {/* Card glow */}

          <div
            className="
              absolute
              inset-0
              rounded-3xl
              bg-blue-500/5
              pointer-events-none
            "
          />

          {/* ==========================================
              SYSTEM READY
          ========================================== */}

          <div className="relative flex items-center gap-3 mb-6">

            <span
              className="
                w-2.5
                h-2.5
                rounded-full
                bg-cyan-400
                shadow-[0_0_15px_#22d3ee]
                animate-pulse
              "
            />

            <span
              className="
                text-cyan-300
                text-xs
                tracking-[4px]
                font-bold
              "
            >
              SYSTEM READY
            </span>

          </div>

          {/* Welcome */}

          <h2 className="relative text-white text-3xl sm:text-4xl font-bold mb-2">
            Welcome back
          </h2>

          <p className="relative text-blue-200 mb-8">
            Sign in to access your personal AI.
          </p>

          {/* ==========================================
              CUSTOM ANIMATED GOOGLE LOGIN BUTTON
          ========================================== */}

          <div className="relative w-full">

            {/* Your original animated button design */}

            <div
              className="
                relative
                group
                w-full
                h-[72px]
                flex
                items-center
                rounded-2xl
                border
                border-cyan-400/60
                bg-blue-500/30
                hover:bg-blue-500/50
                hover:border-cyan-300
                hover:shadow-[0_0_35px_rgba(0,200,255,0.45)]
                transition-all
                duration-300
                hover:-translate-y-1
                active:scale-[0.98]
                cursor-pointer
              "
            >

              {/* Google logo */}

              <div
                className="
                  ml-2
                  w-[56px]
                  h-[56px]
                  flex
                  items-center
                  justify-center
                  bg-white
                  rounded-xl
                  shrink-0
                "
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-7 h-7"
                />
              </div>

              {/* Button text */}

              <div className="flex-1 text-left pl-5">

                <p className="text-white font-bold text-base">
                  Continue with Google
                </p>

                <p className="text-blue-200 text-xs mt-1">
                  Secure authentication
                </p>

              </div>

              {/* Arrow */}

              <div
                className="
                  text-cyan-100
                  text-3xl
                  pr-5
                  transition-transform
                  duration-300
                  group-hover:translate-x-2
                "
              >
                →
              </div>

            </div>

            {/* ==========================================
                INVISIBLE GOOGLE SIGN-IN OVERLAY
            ========================================== */}

            <div
              className="
                absolute
                inset-0
                z-20
                overflow-hidden
                opacity-0
                cursor-pointer
              "
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                auto_select={false}
              />
            </div>

          </div>

          {/* ==========================================
              SECURITY MESSAGE
          ========================================== */}

          <p
            className="
              relative
              text-center
              text-blue-300/70
              text-xs
              mt-7
            "
          >
            ♢ &nbsp; Your account is securely protected
          </p>

        </div>

        {/* ==========================================
            VERSION
        ========================================== */}

        <p
          className="
            text-center
            text-blue-400/50
            text-[10px]
            mt-6
            tracking-[4px]
          "
        >
          TERRIFIC v1.0
        </p>

      </div>

    </div>
  );
}

export default Login;