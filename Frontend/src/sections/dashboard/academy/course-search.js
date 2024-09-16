import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { Box, Button, Card, Stack, SvgIcon, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useCallback, useState } from 'react';

const levelOptions = [
  "NONE",
  "BASIC",
  "INTERMEDIATE",
  "EXPERT"
];

const visibilityOptions = ["VISIBLE", "NON_VISIBLE"];

export const CourseSearch = (props) => {
  const {onFilter, isInstructor} = props
  const [name, setName] = useState("")
  const [level, setLevel] = useState("NONE")
  const [visibility, setVisibility] = useState(true)


  const handleSearchButton = useCallback(() => {
    onFilter({name, level, visibility})
  }, [name, level, visibility])

  return (
    <Card>
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        gap={3}
        sx={{ p: 3 }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            defaultValue=""
            fullWidth
            label="Tên khóa học"
            onChange={(event) => setName(event.target.value)}
            name="query"
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            defaultValue="NONE"
            fullWidth
            label="Phân loại"
            name="subject"
            select
            SelectProps={{ native: true }}
            onChange={(event) => setLevel(event.target.value)}
          >
            {levelOptions.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </TextField>
        </Box>
        {
          isInstructor && 
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              defaultValue="NONE"
              fullWidth
              label="Phân loại"
              name="subject"
              select
              SelectProps={{ native: true }}
              onChange={(event) => setVisibility(event.target.value === "VISIBLE")}
            >
              {visibilityOptions.map((option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ))}
            </TextField>
          </Box>
        }
        <Button
          size="large"
          startIcon={(
            <SvgIcon>
              <SearchMdIcon />
            </SvgIcon>
          )}
          variant="contained"
          onClick={handleSearchButton}
        >
          Tìm kiếm
        </Button>
      </Stack>
    </Card>
  );
};
