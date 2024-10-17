import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { Box, Button, Card, Stack, SvgIcon, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useCallback, useState } from 'react';

const levelOptions = [
  "NONE",
  "BEGINNER",
  "INTERMEDIATE",
  "EXPERT"
];

const visibilityOptions = ["VISIBLE", "NON_VISIBLE", "BOTH"];

export const CourseSearch = (props) => {
  const {onFilter, isInstructor} = props
  const [keyword, setKeyword] = useState("")
  const [level, setLevel] = useState("NONE")
  const [visibility, setVisibility] = useState("BOTH")


  const handleSearchButton = useCallback(() => {
    onFilter({keyword, level, visibility})
  }, [keyword, level, visibility])

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
            label="Từ khóa"
            onChange={(event) => setKeyword(event.target.value)}
            keyword="query"
          />
        </Box>
        {/* <Box sx={{ flexGrow: 1 }}>
          <TextField
            defaultValue="NONE"
            fullWidth
            label="Phân loại"
            keyword="subject"
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
        </Box>*/}
        {
          isInstructor && 
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              defaultValue="NONE"
              fullWidth
              label="Phân loại"
              keyword="subject"
              select
              SelectProps={{ native: true }}
              onChange={(event) => setVisibility(event.target.value)}
              // onKe={handleSearchButton}
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
