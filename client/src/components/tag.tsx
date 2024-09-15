import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Tag } from "../types";
import { tagService } from "../services/http-service";
import { useEffect, useState } from "react";

export const TagChip = ({ tag }: { tag: Tag }) => {
  return <Chip label={tag.name} variant="outlined" />;
};

export const TagList = ({ tags }: { tags: Tag[] }) => {
  return (
    <div className="flex gap-2">
      {tags.map((tag) => (
        <TagChip key={tag._id} tag={tag} />
      ))}
    </div>
  );
};

export const SelectTags = ({
  handleSelection,
  label,
  initialTags = [],
}: {
  handleSelection: (selectedTags: string[]) => void;
  label: string;
  initialTags: string[];
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [options, setOptions] = useState<Tag[]>([]);

  const onSelect = (e: SelectChangeEvent<Array<Tag | string>>) => {
    const lastTag = (e.target.value as Array<string>)[
      e.target.value.length - 1
    ];
    if (selectedTags.includes(lastTag)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== lastTag));
    } else {
      setSelectedTags([...selectedTags, lastTag]);
    }
  };

  const getAllTags = async () => {
    setOptions(await tagService.get("/"));
  };

  useEffect(() => {
    getAllTags();
  }, []);

  useEffect(() => {
    handleSelection(selectedTags);
  }, [selectedTags]);

  function getStyles(_id: string) {
    return {
      fontWeight: selectedTags.includes(_id) ? "800" : "400",
    };
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 400 }} size="small">
      <InputLabel id="tags-chip-label">{label}</InputLabel>
      <Select
        labelId="tags-chip-label"
        multiple
        value={options.filter((tag) => selectedTags.includes(tag._id))}
        onChange={onSelect}
        input={<OutlinedInput label="Chip" />}
        renderValue={(selected: Tag[]) => <TagList tags={selected} />}
      >
        {options.map(({ _id, name }) => (
          <MenuItem key={name} value={_id} style={getStyles(_id)}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
