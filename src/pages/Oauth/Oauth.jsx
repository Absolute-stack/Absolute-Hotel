import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useStore } from "../../store/store.js";
import { setAuthToken } from "../../lib/axios.js";
import { getMe } from "../../api/auth.js";

export default function Oauth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const setAuth = useStore((state) => state.setAuth);

  async function handleOauth() {
    try {
      setAuthToken(token);
      const { user } = await getMe();
      setAuth(user, token);
      navigate("/");
    } catch (error) {
      navigate("/login");
    }
  }
  useEffect(() => {
    if (!token) return navigate("/login");
    handleOauth();
  }, []);

  return <div>siginig you in....</div>;
}
