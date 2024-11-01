import { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { Box, Chip, Divider, Input, Stack, SvgIcon, Typography } from '@mui/material';
import { MultiSelect } from '../../../components/multi-select';
import { useUpdateEffect } from '../../../hooks/use-update-effect';

const stateOptions = [
  {
    label: 'Đã thanh toán',
    value: 'true'
  },
  {
    label: 'Đang xử lí',
    value: 'false'
  }
];

export const ReceiptManageListSearch = (props) => {
  const { onFiltersChange, onSearchChange, ...other } = props;
  const queryRef = useRef(null);
  const [query, setQuery] = useState('');
  const [chips, setChips] = useState([]);

  const handleChipsUpdate = useCallback(() => {
    const filters = {
      isPayment: [],
    };

    chips.forEach((chip) => {
      switch (chip.field) {
        case 'state':
          filters.isPayment.push(chip.value);
          break;
      }
    });
    filters.isPayment = filters.isPayment.length === 2 ? [] : filters.isPayment
    onFiltersChange?.(filters);
  }, [chips, onFiltersChange]);

  useUpdateEffect(() => {
    handleChipsUpdate();
  }, [chips, handleChipsUpdate]);

  const handleChipDelete = useCallback((deletedChip) => {
    setChips((prevChips) => {
      return prevChips.filter((chip) => {
        return !(deletedChip.field === chip.field && deletedChip.value === chip.value);
      });
    });
  }, []);

  const handleQueryChange = useCallback((event) => {
    event.preventDefault();
    setQuery(queryRef.current?.value);
    onSearchChange?.(queryRef.current?.value)
  }, [onSearchChange]);

  const handleSubjectChange = useCallback((values) => {
    setChips((prevChips) => {
      const valuesFound = [];

      // First cleanup the previous chips
      const newChips = prevChips.filter((chip) => {
        if (chip.field !== 'state') {
          return true;
        }

        const found = values.includes(chip.value);

        if (found) {
          valuesFound.push(chip.value);
        }

        return found;
      });

      // Nothing changed
      if (values.length === valuesFound.length) {
        return newChips;
      }

      values.forEach((value) => {
        if (!valuesFound.includes(value)) {
          const option = stateOptions.find((option) => option.value === value);

          newChips.push({
            field: 'state',
            value,
            displayValue: option.label
          });
        }
      });

      return newChips;
    });
  }, []);
  
  const stateValues = useMemo(() => chips
    .filter((chip) => chip.field === 'state')
    .map((chip) => chip.value), [chips]);

  const showChips = chips.length > 0;

  return (
    <div {...other}>
      <Stack
        alignItems="center"
        component="form"
        direction="row"
        onSubmit={handleQueryChange}
        spacing={2}
        sx={{ p: 2 }}
      >
        <SvgIcon>
          <SearchMdIcon />
        </SvgIcon>
        <Input
          disableUnderline
          fullWidth
          inputProps={{ ref: queryRef }}
          placeholder="Tìm kiếm tên người dùng"
          onChange={handleQueryChange}
          sx={{ flexGrow: 1 }}
          value={query}
        />
      </Stack>
      <Divider />
      {showChips
        ? (
          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            gap={1}
            sx={{ p: 2 }}
          >
            {chips.map((chip, index) => (
              <Chip
                key={index}
                label={(
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      '& span': {
                        fontWeight: 600
                      }
                    }}
                  >
                    {chip.displayValue || chip.value}
                  </Box>
                )}
                onDelete={() => handleChipDelete(chip)}
                variant="outlined"
              />
            ))}
          </Stack>
        )
        : (
          <Box sx={{ p: 2.5 }}>
            <Typography
              color="text.secondary"
              variant="subtitle2"
            >
              Không có bộ lọc nào được chọn
            </Typography>
          </Box>
        )}
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        spacing={1}
        sx={{ p: 1 }}
      >
        <MultiSelect
          label="Tình trạng thanh toán"
          onChange={handleSubjectChange}
          options={stateOptions}
          value={stateValues}
        />
      </Stack>
    </div>
  );
};

ReceiptManageListSearch.propTypes = {
  onFiltersChange: PropTypes.func
};
