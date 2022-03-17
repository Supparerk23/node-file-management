# node-file-management
poc microservice for management file on server

Troubleshooting
===============

if you're seeing an error containing `EISDIR` it may be related with permission of directory.

It has the right permissions. You can change the file to have all permissions with "sudo chmod 777 FILE_NAME". (Careful: You are giving Read, Write and Execute permissions to every one on that file)

Please see [this issue](https://stackoverflow.com/a/42677294) for more details.
