import NextLink from 'next/link';
import { paths } from '../../paths';
import { Box, Button, Container, Rating, Stack, SvgIcon, Typography, Divider, Grid  } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const Home = () =>{
    const theme = useTheme();
    const fillColor = theme.palette.primary.main;

    return (
        <Box minWidth={1000}>
            <svg viewBox="0 0 500 200" transform="rotate(180)" style={{position: 'absolute', bottom: 0}}>
                <path d="M 0 50 C 150 150 300 0 500 80 L 500 0 L 0 0" fill="rgb(57, 27, 112)"></path>
                <path d="M 0 50 C 150 150 330 -30 500 50 L 500 0 L 0 0" fill={fillColor} opacity="0.8"></path>
                <path d="M 0 50 C 215 150 250 0 500 100 L 500 0 L 0 0" fill={fillColor} opacity="0.5"></path>
            </svg>
            <Grid
                container
                alignItems={'center'}
                sx={{
                    position: {xs: 'absolute'},
                    top: {xs: '15%'},
                }}
            >   
                <Grid
                    item 
                    xl = {7}    
                    xs = {12}   
                    sx = {{
                        fontSize: '150px',
                        textAlign: 'center'
                    }}
                >
                    LEARNING SYSTEM
                </Grid>

                <Grid
                    item 
                    xl = {5}    
                    xs = {12}
                >
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 1, sm: 2, md: 4 }}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <Button
                            component={NextLink}
                            href={paths.usedAuth.jwt.register}
                            sx={
                                (theme) => 
                                    theme.palette.mode === 'dark'
                                    ? {
                                        backgroundColor: 'neutral.50',
                                        color: 'neutral.900',
                                        '&:hover': {
                                        backgroundColor: 'neutral.200'
                                        }
                                    }
                                    : {
                                        backgroundColor: 'neutral.900',
                                        color: 'neutral.50',
                                        '&:hover': {
                                        backgroundColor: 'neutral.700'
                                        }
                                    }
                            }
                            style = {{
                                width: '50%',
                                minHeight: '80px',
                                maxWidth: '300px',
                                fontSize: '18px'
                            }}
                            variant="contained"
                        >
                            Sign up
                        </Button>

                        <Button
                            component={NextLink}
                            href={paths.usedAuth.jwt.login}
                            sx={(theme) => theme.palette.mode === 'dark'
                            ? {
                                backgroundColor: 'neutral.50',
                                color: 'neutral.900',
                                '&:hover': {
                                backgroundColor: 'neutral.200'
                                }
                            }
                            : {
                                backgroundColor: 'neutral.900',
                                color: 'neutral.50',
                                '&:hover': {
                                backgroundColor: 'neutral.700'
                                }
                            }}
                            style = {{
                                width: '50%',
                                minHeight: '80px',
                                maxWidth: '300px',
                                fontSize: '18px'
                            }}
                            variant="contained"
                        >
                            Sign in
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}
