# Google Tag Manager Exported Container Filter
Filter a subset of Tags from exported Google Tag Manager (GTM) containers

## Overview
### Use case
You want to duplicate a GTM container but only need a subset of the tags.

### Supports filtering by
Currently:
* A single Folder name (this is a folder in GTM)

Could be enhanced without much difficulty to also support:
* Multiple Folder names
* Multiple Tag names

### Features
* It will (recursively) include Triggers and Variables that the Tags depend on
* It will include original Folder names for all included Triggers and Variables, as well as the original Folder that matched your search and contains the tags

## How to use
### 1. Export your source GTM container as a JSON file
See https://support.google.com/tagmanager/answer/6106997?hl=en

### 2. Clone this repo

### 3. Initialize the project

```
npm i
```

### 4. Create a JSON config file
Create your own or modify the existing `config.example.json` file.

Properties for configuration:
* **folders**

  A search string used to match folders and extract the Tags within them. Can be a partial match. No regex.

Example:
```json
{
  "folders": "Folder Name"
}
```

### 5. Run the app, pointing to your config and container files

```
npm run start -- --config=config.json --input=containers/GTM-XXXXXX_workspaceXXX.json
```

### 6. Your new container file will be created in the same directory, appended with `-filtered`

E.g.
```
containers/GTM-XXXXXX_workspaceXXX-filtered.json
```

### 7. Import the new container file to your destination GTM property
See https://support.google.com/tagmanager/answer/6106997?hl=en
