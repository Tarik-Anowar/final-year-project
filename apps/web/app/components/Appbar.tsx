'use client';
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Popover, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import styles from '../styles/appBar.module.css';
import UserAvatar from './userAvatar';
import { signOut, useSession } from 'next-auth/react';

const MyAppBar = () => {
    const { data: session, status } = useSession();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'user-popover' : undefined;

    return (
        <AppBar position="static" className={styles.appBar}>
            <Toolbar>
                {status === 'authenticated' ? (
                    <div>
                        <IconButton onClick={handleAvatarClick}>
                            <UserAvatar userId={session?.user?.id} name={session?.user?.name} imageUrl={session?.user?.image} size={40} />
                        </IconButton>

                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <Box p={2} style={{ minWidth: '200px' }}>
                                <Typography variant="h6">{session?.user.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {session?.user.email}
                                </Typography>
                                <Box mt={2}>
                                    <UserAvatar userId={session?.user?.id} name={session?.user?.name} imageUrl={session?.user?.image} size={80} />
                                </Box>
                                <Button
                                    fullWidth
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    onClick={() => signOut()}
                                >
                                    Sign Out
                                </Button>
                            </Box>
                        </Popover>
                    </div>
                ) : (
                    <>
                        <Link href="/api/auth/signin" passHref>
                            <Button color="inherit" sx={{ marginRight: 1 }}>
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/api/auth/signup" passHref>
                            <Button color="inherit">Sign Up</Button>
                        </Link>
                    </>
                )}

                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    className={styles.menuIcon}
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default MyAppBar;
