import { ThemeProvider } from "@mui/material";
import { Header } from "./components/header";
import theme from "./theme";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Home } from "./routes/home";
import { AccountPreferences } from "./routes/account-preferences";
import { RecipePage } from "./routes/recipe";
import { RecipeForm } from "./routes/recipe-form";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    if (token) {
      Cookies.set("token", token, { expires: 3 });
      navigate("/");
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <div className="m-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/preferences" element={<AccountPreferences />} />
          <Route path="/recipe/new" element={<RecipeForm />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
          <Route path="/recipe/:id/edit" element={<RecipeForm />} />
        </Routes>
        <ToastContainer />
      </div>
    </ThemeProvider>
  );
}

export default App;
