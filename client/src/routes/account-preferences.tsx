import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { SelectTags } from "../components/tag";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "../state";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/http-service";
import { User } from "../types";

export const AccountPreferences = () => {
  const user = useStore((state) => state.loggedUser);
  const updateUser = useStore((state) => state.initUser);

  const navigate = useNavigate();
  const [preferedTags, setPreferedTags] = useState<string[]>(
    user?.preferedTags ?? []
  );
  const [maxPrepTime, setMaxPrepTime] = useState<number>(
    user?.maxPreferedPreperationTimeMinutes ?? 0
  );

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    setPreferedTags(user?.preferedTags ?? []);
    setMaxPrepTime(user?.maxPreferedPreperationTimeMinutes ?? 0);
  }, [user]);

  const handleTagSelection = (selected: string[]) => {
    setPreferedTags(selected);
  };

  const submitForm = async () => {
    const res: User = await userService.patch("/me", {
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        preferedTags,
        maxPreferedPreperationTimeMinutes: maxPrepTime,
      }),
    });
    if (res) {
      updateUser(res);
      toast.success("preferences succesfully updated! ");
    }
  };

  return (
    <Box>
      <Card sx={{ boxShadow: 0, maxWidth: 800, margin: "auto" }}>
        <CardContent className="flex flex-col gap-8">
          <div>
            <Typography variant="h6">
              Let's set up some preferencecs ✨
            </Typography>
            <Typography variant="body2">
              It helps us showing you better reccomendation on the home page :)
            </Typography>
          </div>

          <div>
            <Typography variant="body1" color="primary">
              Try to choose at least 3 tags:
            </Typography>
            <SelectTags
              label="tags"
              initialTags={user?.preferedTags ?? []}
              handleSelection={handleTagSelection}
            />
          </div>

          <div>
            <Typography variant="body1" color="primary">
              What is the optimal max preperation time in your opinion?
            </Typography>
            <FormControl
              sx={{ m: 1, width: "25ch" }}
              variant="outlined"
              size="small"
            >
              <OutlinedInput
                value={maxPrepTime}
                onChange={(e) => setMaxPrepTime(+e.target.value)}
                type="number"
                endAdornment={
                  <InputAdornment position="end">minutes</InputAdornment>
                }
              />
            </FormControl>
          </div>
          <div className="flex justify-end">
            <Button size="large" variant="contained" onClick={submitForm}>
              Done! 💁‍♀️
            </Button>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
};
