
import * as yup from "yup";

export const fileSchema = yup.object().shape({
    name: yup.string().required("File name is required"),
    size: yup.number().required("File size is required")
});

export const paperSchema = yup.object().shape({
    filename: yup.string().required("a file must be selected"),
    tags: yup.array().of(yup.string()),
    mime_type: yup.string().required("a mimetype is required").oneOf(['image/png', 'image/jpg', 'image/jpeg']),
    size: yup.number().required("a file size is required"),
    category: yup.string().required("Please select a category"),
    source: yup.string(),
});


