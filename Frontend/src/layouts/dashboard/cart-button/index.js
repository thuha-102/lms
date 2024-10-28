import { useCallback, useRef, useState } from 'react';
import { Avatar, Box, ButtonBase, SvgIcon, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../../../hooks/use-auth';
import { useRouter } from 'next/navigation';
import { paths } from '../../../paths';

export const CartButton = () => {
    const { user } = useAuth();
    const anchorRef = useRef(null);
    const router = useRouter();

    const handleClickButton = useCallback(() => router.push(paths.dashboard.cart));

    return (
        <>
        <Box
            component={ButtonBase}
            onClick={handleClickButton}
            ref={anchorRef}
            sx={{
            alignItems: 'center',
            display: 'flex',
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: 'divider',
            height: 40,
            width: 40,
            borderRadius: '50%'
            }}
        >
            <Badge
                color="error"
                invisible={true}
                // invisible={user.inCart === 0}
                // badgeContent={user.inCart}
            >
                <Avatar
                    sx={{
                        height: 32,
                        width: 32
                    }}
                    src={user ? user.avatar : null}
                >
                    <SvgIcon>
                        <ShoppingCartIcon filled="none"/>
                    </SvgIcon>
                </Avatar>
            </Badge>
        </Box>
        </>
    );
};
