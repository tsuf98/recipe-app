import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useStore } from "../state";
import { API_URL, userService } from "../services/http-service";
import { useEffect } from "react";
import { User } from "../types";

export const Header = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.loggedUser);
  const initUser = useStore((state) => state.initUser);

  const token = Cookies.get("token");

  const getLoggedUser = async () => {
    if (token && !user) {
      const loggedUser: User = await userService.get("/me");
      if (loggedUser) {
        initUser(loggedUser);
        if (
          !loggedUser.maxPreferedPreperationTimeMinutes ||
          loggedUser.preferedTags.length === 0
        ) {
          navigate("/preferences");
        }
      } else {
        Cookies.remove("token");
      }
    }
  };

  useEffect(() => {
    getLoggedUser();
  }, [token]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        color="secondary"
        sx={{ borderRadius: "0 0 16px 16px", boxShadow: 0 }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1 }}
            className="flex gap-2"
          >
            <img src="/cake.webp" className="w-8 h-8" />
            Recipes :)
          </Typography>
          {!token && (
            <Button
              color="inherit"
              component="a"
              href={`${API_URL}/auth/google`}
            >
              Login with Google
            </Button>
          )}
          {user && (
            <div className="flex gap-4 items-center">
              <Typography>Hello {user.name}</Typography>
              <Button component={Link} to="/recipe/new" variant="contained">
                + create new recipe
              </Button>
              <Button component={Link} to="preferences" variant="contained">
                User Preferences
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
