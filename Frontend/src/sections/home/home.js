import NextLink from 'next/link';
import { paths } from '../../paths';
import { Box, Button, Container, Rating, Stack, SvgIcon, Typography, Divider, Grid  } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const Home = () =>{
    const theme = useTheme();
    const fillColor = theme.palette.primary.main;

    return (
        <Box>
            <svg viewBox="0 0 500 200" transform="rotate(180)" style={{position: 'absolute', bottom: 0}}>
                <path d="M 0 50 C 150 150 300 0 500 80 L 500 0 L 0 0" fill="rgb(57, 27, 112)"></path>
                <path d="M 0 50 C 150 150 330 -30 500 50 L 500 0 L 0 0" fill={fillColor} opacity="0.8"></path>
                <path d="M 0 50 C 215 150 250 0 500 100 L 500 0 L 0 0" fill={fillColor} opacity="0.5"></path>
            </svg>
            <Grid
                container
            >   
                <Grid
                    item 
                    xl = {8}    
                    xs = {12}   
                    sx = {{
                        position: 'absolute',
                        top: '20%',
                        fontSize: '150px',
                        textAlign: 'center'
                    }}
                >
                    AI LEARNING SYSTEM
                </Grid>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1, sm: 2, md: 4 }}
                    sx = {{
                        position: 'absolute',
                        top: { md: '80%', lg: '40%' },
                        right: { md: '5%', lg: '10%' },
                        height: '80px',
                        width: '600px'
                    }}
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
                            fontSize: '18px'
                        }}
                        variant="contained"
                    >
                        Sign in
                    </Button>
                </Stack>
            </Grid>
        </Box>
    );
}
