import { useNavigate } from "react-router-dom";
interface AuthErrorModalProps {
  isOpen: boolean;
  onClose: () => void; // A function that takes no arguments and returns nothing
}
const AuthErrorModal = ({ isOpen, onClose }: AuthErrorModalProps) => {
  const navigate = useNavigate();

  // DaisyUI controls visibility by adding/removing the 'modal-open' class,
  // so we don't need the early return (if (!isOpen) return null) anymore.

  const handleLoginRedirect = () => {
    onClose();
    navigate("/login");
  };

  const handleRegisterRedirect = () => {
    onClose();
    navigate("/register");
  };

  const handleDemoAccount = () => {
    onClose();
    navigate("/login", {
      state: {
        demoData: {email:'demo@example.com', password:'demostream@123'}
      },
    });
  };
  return (
    <div
      className={`modal ${isOpen ? "modal-open" : ""} modal-bottom sm:modal-middle`}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg text-error">Access Denied</h3>

        <p className="py-4 text-base-content/80">
          It looks like your session has expired or you are not authorized to
          view this page. Please log in or create an account to continue.
        </p>

        {/* 'modal-action' automatically aligns buttons to the bottom right */}
        <div className="modal-action">
          <button className="btn btn-primary" onClick={handleLoginRedirect}>
            Go to Login
          </button>

          <button
            className="btn btn-ghost bg-base-200"
            onClick={handleRegisterRedirect}
          >
            Register
          </button>
          <button
            className="btn btn-ghost bg-base-200"
            onClick={handleDemoAccount}
          >
            Use Demo Acc
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthErrorModal;
