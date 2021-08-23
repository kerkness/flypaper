import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import Grid from '@material-ui/core/Grid';
// import TextField from '../../components/InputTextField';
import SelectField from '../../components/InputSelectField';
import InputTagsField from '../../components/InputTagsField';
import Uppy from '@uppy/core';
import ThumbnailGenerator from '@uppy/thumbnail-generator'
import AwsS3Multipart from '@uppy/aws-s3-multipart'
import { DragDrop, ProgressBar, useUppy } from '@uppy/react';
import { useNav } from '../nav/navSlice';
import { useAuth } from '../admin/authSlice';
import '@uppy/core/dist/style.css'
import '@uppy/drag-drop/dist/style.css'
import { useSubmission } from './submitSlice';
import { useFormik } from 'formik';
import { paperSchema } from '../../schema/paper';
import { usePaper } from '../browser/paperSlice';


const useStyles = makeStyles({
    list: {
        margin: 0,
        flexGrow: 1,
        width: '450px',
        // maxWidth: '90%',
        paddingRight: "20px",
        paddingLeft: "20px",
        overflowX: "hidden",
        overflowY: "auto",
        backgroundColor: 'rgba(60,80,90,0.9)'
    },
    paragraph: {
        color: '#eeeeee',
        marginBottom: 20,
    },
    grid: {
        flexGrow: 1,
        minHeight: '100%',
        // backgroundColor: 'pink'
    },
    drawer: {
        paper: {
            marginRight: 0,
        }
    },
    droparea: {
        backgroundColor: 'transparent',
        height: '200px'
    },
    preview: {
        margin: 'auto',
    },
    progress: {
        root: {
            width: '100%'
        }
    },
    cancelButton: {
        marginLeft: '20px',
        color: '#EEEEEE'
    },
    savedCheck: {
        width: 150,
        color: 'green'
    }
});


export default function SubmitPaper(props) {

    const classes = useStyles();

    const { user, token } = useAuth();
    const { addPapers, addNewPaper } = usePaper();
    const { submitOpen, openSubmit, closeSubmit } = useNav();
    const is_saving = useRef();
    const {
        upload,
        submission,
        categories,
        setFieldValue,
        clearSubmission,
        uploadPreview,
        uploadProgress,
        uploadStarted,
        uploadCompleted,
    } = useSubmission();

    const form = useFormik({
        initialValues: submission,
        validationSchema: paperSchema,
    });

    // Monitor our submission.
    // If Ready to save and we have an upload key then save
    useEffect(() => {

        if(submission.ready && submission.source && !is_saving.current) {
            is_saving.current = true;
            saveUpload();
        }

    }, [submission])



    const uppy = useUppy(() => {
        return new Uppy({
            meta: { type: 'wallpaper' },
            restrictions: {
                maxNumberOfFiles: 1,
                allowedFileTypes: ['image/jpeg', 'image/png', 'image/jpg'],
                maxFileSize: 11000000
            },
            autoProceed: false,
        }).use(AwsS3Multipart, {
            limit: 4,
            companionUrl: '/',
        })
            .use(ThumbnailGenerator, {
                thumbnailHeight: 200,
                thumbnailWidth: 400,
                waitForThumbnailsBeforeUpload: true,
            })
            .on('file-added', (file) => {
                setFieldValue('filename', file.name)
                setFieldValue('mime_type', file.type)
                setFieldValue('size', file.size)
                form.setFieldValue('filename', file.name)
                form.setFieldValue('mime_type', file.type)
                form.setFieldValue('size', file.size)
            }).on('thumbnail:generated', (file, preview) => {
                uploadPreview(preview);
            })
            .on('upload', (data) => {
                uploadStarted();
            })
            .on('progress', (progress) => {
                uploadProgress(progress);
            })
            .on('upload-success', async(file, response) => {
                setFieldValue('source', file.s3Multipart.key)
                form.setFieldValue('source', file.s3Multipart.key);
            })
            .on('complete', (result) => {
                uploadCompleted();
            });
    });

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        if (open) {
            openSubmit();
        } else {
            cancelSubmit();
        }
    };

    const onChange = (value, field) => {
        setFieldValue(field, value)
        form.setFieldValue(field, value)
    }

    const handleSubmit = () => {

        // Make sure the form is valid
        if (!form.isValid) return;

        uppy.upload().then((result) => {

            if(result.successful) {
                setFieldValue('ready', true);
            }

            if (result.failed.length > 0) {
                result.failed.forEach((file) => {
                    console.error(file.error)
                })
            }
        })
    }

    const inspectUpload = () => {
        return  api.axiosPost(
            "/api/inspect-upload",
            {
                source: form.values.source,
            }, 
            token
        ).then(response => {

            return response.data;

        }).catch(error => {
            console.log("Inspection Error", error);
        });    

    }

    const saveUpload = () => {

        inspectUpload().then(
            response => {

                api.axiosPost(
                    "/api/submit-paper",
                    {
                        ...form.values,
                        ...response,
                    },
                    token
                ).then(response => {
        
                    addNewPaper(response.data);
                    setFieldValue('saved', true);
                    is_saving.current = false;
        
        
                }).catch(error => {
                    console.log("Submission Error", error);
                });    
        
            }
        )

    }

    const cancelSubmit = () => {
        clearSubmission();
        closeSubmit();
        uppy.reset();
        form.resetForm();
    }

    return (
        <div>
            <React.Fragment>
                <Drawer className={classes.drawer} anchor={'right'} open={submitOpen} onClose={toggleDrawer(false)}>
                    <div
                        className={clsx(classes.list)}
                        role="presentation"
                    >
                        { !submission.saved && 
                        <Grid container
                            className={classes.grid}
                            spacing={3}
                            direction="column"
                            justifyContent="center"
                            alignItems="stretch"
                        >
                            <Grid item>
                                <Typography className={classes.paragraph} variant="body1" align="center">
                                Images with gamer tags, or visible huds will be denied.
                                </Typography>
                            </Grid>
                            <Grid item className={classes.file}>
                                {
                                    (upload.preview) && <Grid container
                                        spacing={0}
                                        direction="column"
                                        justifyContent="center"
                                        alignItems="stretch"
                                    >
                                        <img className={classes.preview} src={upload.preview} />
                                        <Fade
                                            in={upload.uploading}
                                            style={{
                                                transitionDelay: upload.uploading ? '100ms' : '0ms',
                                            }}
                                            unmountOnExit
                                        >
                                            <LinearProgress className={classes.progress} color="secondary" variant="determinate" value={upload.progress} />
                                        </Fade>
                                    </Grid>
                                }
                                {
                                    (!upload.preview) && <DragDrop
                                        width="100%"
                                        height="200px"
                                        uppy={uppy}
                                        locale={{
                                            strings: {
                                                dropHereOr: 'Drop here or %{browse} (11 megs max)',
                                                browse: 'browse'
                                            }
                                        }}
                                    />

                                }
                            </Grid>
                            <Grid item>
                                <SelectField
                                    name="category"
                                    label="Category"
                                    form={form}
                                    options={categories}
                                    value={submission.category}
                                    onChange={(e) => onChange(e.target.value, 'category')}
                                />
                            </Grid>
                            <Grid item>
                                <InputTagsField
                                    name="tags"
                                    label="Tags"
                                    value={submission.tags}
                                    onChange={(tags) => onChange(tags, 'tags')}
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="default"
                                    onClick={handleSubmit}
                                    disabled={!submission.filename || !form.isValid || upload.uploading}
                                >Submit</Button>
                                <Button
                                    className={classes.cancelButton}
                                    color="default"
                                    onClick={cancelSubmit}
                                >Cancel</Button>
                            </Grid>
                        </Grid>
                        }
                        {
                            submission.saved && <Grid container
                            className={classes.grid}
                            spacing={3}
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            >
                                    <Typography align="center" className={classes.paragraph} variant="body2">
                                        Thanks {user.name}
                                    </Typography>
                                    <Typography align="center" className={classes.paragraph} variant="body2">
                                        Your submission will be manually approved. To skip this step, contact Kerkness on discord.
                                    </Typography>
                                    <IconButton color="default" onClick={cancelSubmit}>
                                        <CheckCircleIcon fontSize="large" />
                                    </IconButton>
                            </Grid>
                        }
                    </div>
                </Drawer>
            </React.Fragment>
        </div>
    );
}

