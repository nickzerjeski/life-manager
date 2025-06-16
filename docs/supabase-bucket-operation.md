# Supabase Bucket Operations

## 1. Create Bucket
```javascript 
await supabase.storage.createBucket('bucket_name', { public: true|false });
```
## 2. List Buckets
```javascript 
const { data, error } = await supabase.storage.listBuckets();
```
## 3. Get Specific Bucket
```javascript 
const { data, error } = await supabase.storage.getBucket('bucket_name');
```
## 4. List Files in Bucket
```javascript 
const { data, error } = await supabase
  .storage
  .from('bucket_name')
  .list('optional/path', { limit, offset, sortBy, search });
```
## 5. Upload File
```javascript 
const file = event.target.files[0];
const { data, error } = await supabase
  .storage
  .from('bucket_name')
  .upload(`path/${file.name}`, file, {
    cacheControl: '3600',
    upsert: false
  });
```
## 6. Download File
```javascript 
const { data, error } = await supabase
  .storage
  .from('bucket_name')
  .download('path/to/file.ext');
```
## 7. Create Signed URL (Private)
```javascript 
const { data, error } = await supabase
  .storage
  .from('bucket_name')
  .createSignedUrl('path/to/file.ext', expirySeconds);
```
## 8. Get Public URL
```javascript 
const { publicUrl, error } = supabase
  .storage
  .from('bucket_name')
  .getPublicUrl('path/to/file.ext');
```
## 9. Manage Files
```javascript 
// Replace
.upload(path, file, { upsert: true });
// Move
.move('fromPath', 'toPath');
// Copy
.copy('bucket', 'fromPath', 'toPath');
// Delete
.remove(['path/to/file.ext']);
```
## 10. Delete or Empty Bucket
```javascript 
await supabase.storage.emptyBucket('bucket_name');
await supabase.storage.deleteBucket('bucket_name');
```
## React Specific Notes
- Use native `File` from `<input type="file" />`.
- For React Native, use `ArrayBuffer` via Expo/FileSystem and `decode()`.
- Structure per-user folders inside buckets.