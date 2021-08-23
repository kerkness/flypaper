<?php

return [
    's3' => [
        'bucket' => [
            /*
             * Folder on bucket to save the file
             */
            'folder' => 'flypaper',
        ],
        'presigned_url' => [
            /*
             * Expiration time of the presigned URLs
             */
            'expiry_time' => '+1 hour',
        ],
    ],
];
