# Magia Record Character List

[Homepage](https://leo-chan.me/magireco) | [GitHub](https://github.com/Leochan6/leochan6.github.io/tree/master/magireco) | [Issues](https://github.com/Leochan6/leochan6.github.io/issues) | [Reddit](https://www.reddit.com/user/Leochan6/) | Discord: Leo_Chan#9150

Magia Record Character List is a web tool for creating a list of Magical Girls and their upgrade status from the game [Magia Record: Puella Magi Madoka Magica Side Story](https://magiarecord-en.com/).

This project is the new version of a previous project, [Magia Record Character Grid Creator Interface](https://www.figma.com/community/plugin/764389386376321679/Magia-Record-Character-Grid-Creator-Interface), an extension of the prototyping tool Figma.

For any feedback or questions, please contact me the locations listed above.

![List Preview](https://raw.githubusercontent.com/Leochan6/leochan6.github.io/master/magireco/assets/preview/list.png)

## Features

- [Character Lists](#Character-Lists)
- [Characters](#Characters)
- [Sorting Profiles](#Sorting-Profiles)
- [Display Settings](#Display-Settings)
- [Background](#Background)
- [User](#User)
- [Import and Export](#Import-and-Export)
- [Filters](#Filters)
- [Statistics](#Statistics)

## Usage

### Character Lists

- Create Character List

    Press the `+` button under the `My Character Lists` tab, enter a name in the field and press `Create`.

- Select Character List

    Under the `My Character Lists` tab, if a list has already been created, an buttons for each created Character List will appear, press the corresponding button to select the list.

- Rename Character List

    Select a Character List and press the <img src="https://leo-chan.me/magireco/assets/icon/edit_black.png" alt="rename" title="rename" height="12"/> button  under the `My Character Lists` tab, enter a new name in the field and press `Rename`.

- Duplicate Character List

    Select a Character List and press the <img src="https://leo-chan.me/magireco/assets/icon/file_copy_black.png" alt="duplicate" title="duplicate" height="12"/> button  under the `My Character Lists` tab, enter a new name in the field and press `Duplicate`.

- Delete Character List

    Select a Character List and press the `×` button  under the `My Character Lists` tab and press `OK`.

### Characters

- Create Character

    Without a Character selected, change the values in the form under the `Create Character` tab. Press the <img src="https://leo-chan.me/magireco/assets/icon/magical_girls.png" alt="magical girls" title="magical girls" height="15"/> button to see a visual list of the character available and who is already created in the list (there is a check box to disable the visibility of already created characters). You can also use the search box to narrow down the list of girls. The available fields in the form are `Name`, `Rank`, `Post Awaken`, `Experience`, `Magic Level`, `Magia Level`, `Episode Level`, and `Doppel`. Once all the fields are filled as desired and there are no errors, the preview will be updated with the details. Then press the `Create` button to add to the list, if a Character List has been created and selected.

- Select Character

    With a Character List selected, press on the Character in the list to select and the values in the `Create Character` tab's form will be updated with the properties of the selected character.

- Deselect Character

    With a Character List selected, click anywhere in the Character List to deselect the selected Character, or press the `Esc` key.

- Update Character

    With a Character from a Character List selected, any valid changes to the form will automatically be updated to the Character in the list.

- Delete Character

    With a Character List selected, press on the Character in the list to select and press the `Delete` button.

- Minimize Character

    With the desired name of a character selected, press the `Min All` button and all the fields in the form will be set as the minimum for that character.
  
- Maximize Character

    With the desired name of a character selected, press the `Max All` button and all the fields in the form will be set as the maximum for that character.

### Sorting Profiles

- Create Profile

    Under the `Sorting Profiles` tab, press the first `+` button to show the new profile form, enter a new profile name, press `Create`, and a new profile will be created with the same rules as the previously selected profile.

- Select Profile

    Under the `Sorting Profiles` tab, press the first `Profile` select dropdown to show the list of available profiles, press the profile to select.

- Add Rule

    Under the `Sorting Profiles` tab, press the second or lower `+` button to create a new rule below the current rule. Rules can be either a `Group By` or a `Sort By` rule with the following attributes: `Attribute`, `Rank`, `Post Awaken`, `Level`, `Magic`, `Magia`, `Episode`, `Doppel`, `Obtainability`, and `Character ID`. Certain attributes cannot be grouped by, such as `Level` and `Character ID`. The order of the grouping or sorting can be changed by pressing the `▼ (descending)` or `▲ (ascending)` buttons. The order of the rules matter, as the groups are nested and the sorting is done one after another, to order is top to bottom. Grouping is always done before sorting. The `Default` profile cannot have rules added to it, so adding a rule will automatically change to the `Custom` profile.

- Edit Rule

    Under the `Sorting Profiles` tab, change the desired rule by changing the dropdowns. The `Default` profile cannot have its rules rules edited, so editing a rule will automatically change to the `Custom` profile.

- Delete Rule

    Under the `Sorting Profiles` tab, delete the desired rule by pressing the `×` button. A profile must have at least 1 rule, so the last rule in the profile cannot be deleted.

### Display Settings

- Displays Per Row

    Under the `Display Settings` tab, the `Displays Per Row` field determines how many characters are displayed in a single row in the Character List. If a group has more character than the number, then they will continue on the next line. Increase the number to higher than the maximum characters in the row will lead to more white space in the list.

- Alignment

    Under the `Display Settings` tab, the `Alignment` field determines how the Character in the Character List are justified. The options are `Left`, `Center`, and `Right`.

- Padding X

    Under the `Display Settings` tab, the `Padding X` field determines how much space is on the left and right of the Character List, thus increasing the border around the edge-most Characters.

- Padding Y

    Under the `Display Settings` tab, the `Padding X` field determines how much space is on the top and bottom of the Character List, thus increasing the border around the edge-most Characters.

### Background

- Create Background

    Under the `Background` tab, select the background from the `Background` dropdown to select a background. A background can also be selected by pressing the `+` button to see a visual list of the background available as well as a search bar. 

- Delete Background

    Under the `Background` tab, press the `×` button to remove the selected background.

- Background Transparency

    Under the `Background` tab, change the `Transparency` field or slider to change the transparency of the selected background. **Currently, the transparency of the background is not support on Image Export.** For a transparent background, removed the background and set the transparency to `0`.

### User

- Edit User Name

    Under the `User Settings` tab, change the `Name` field and press `Save` to change the user name.

- Edit Player ID

    Under the `User Settings` tab, change the `Player ID` field and press `Save`. If the Player ID is already in use, then this operation will fail. If this is believed to be a mistake and someone else has taken your Player ID, please contact Leo Chan.

- Edit Public List

    Under the `User Settings` tab, change the `Public List` dropdown and press `Save`.

### Import and Export

- Save Image

    Press the Export: `Save` button to save an image of the Character List. The name of the file is `[List Name]_[Current Date and Time].png`. The file may be saved with a `.txt` extension and not open with the default image viewer of the the operating system, so select the correct program to open it if needed.

- View Image

    Press the Export: `View` button to view the image of the Character List in a new tab. The the image can be copied, but the file name will not be anything specific.

- Export Text

    Press the Export `Text` button to get the Character List in a JSON text format. Copy and save the text to share or to import at a later date.

- Import Text

    Press the Import `Text` button to import a Character List from the JSON text format. Enter the new list name and paste the text into the `JSON` field, and press `Import`.

### Filters

- Create Filter

    Press the `New` button to create a new filter. Select from the dropdown the property to filter on, how to filter, and what to filter by. The available properties to filter on are `Attribute`, `Rank`, `Post Awaken`, `Min Rank`, `Max Rank`, `Level`, `Magic`, `Magia`, `Episode`, `Doppel`, and `Obtainability`, which can be filtered as `equal to`, `not equal to`, `less than`, `greater than`, `less than or equal to`, and `greater than or equal to`. Some properties only have the `equal to` and `not equal to` options. If a filter has already been created, press the `+` button to create a new filter above the pressed filter.

- Delete Filter

    Press the `×` button to delete the selected filter.

- Apply Filters

    Press the `Apply` button to apply the created filters.

- Reset Filters

    Press the `Reset` button the delete all the filters.

- Minimize Filters

    Press the `-` button to hide all the filters. Press the `+` button to show all the filters.

### Zoom

- Change Zoom

    Enter the zoom level in the `Zoom` text field or change the `Zoom` slider range.

### Statistics

- Visibility Statistic

    In the Top Right of the screen, there is a count showing the number of characters that are visible in the list based on the current `Filters`.

- Statistics

    Press the `Stats` button to open the Stats dialog, showing a detailed breakdown of the statistics of the characters in the Character List and other details.

## Gallery
List Preview Light

![List Preview Light](https://raw.githubusercontent.com/Leochan6/leochan6.github.io/master/magireco/assets/preview/list.png)

List Preview Dark

![List Preview Dark](https://raw.githubusercontent.com/Leochan6/leochan6.github.io/master/magireco/assets/preview/list_dark.png)

Export Image

![Export Image Preview](https://raw.githubusercontent.com/Leochan6/leochan6.github.io/master/magireco/assets/preview/export_image.png)

Export Image Transparent

![Export Image Transparent Preview](https://raw.githubusercontent.com/Leochan6/leochan6.github.io/master/magireco/assets/preview/export_image_transparent.png)

Create Character

![Create Character Preview](https://raw.githubusercontent.com/Leochan6/leochan6.github.io/master/magireco/assets/preview/create_character.png)

Character Select

![Character Select Preview](https://raw.githubusercontent.com/Leochan6/leochan6.github.io/master/magireco/assets/preview/character_select.png)

Background Select

![Background Select Preview](https://raw.githubusercontent.com/Leochan6/leochan6.github.io/master/magireco/assets/preview/background_select.png)

Filters

![Filters Preview](https://raw.githubusercontent.com/Leochan6/leochan6.github.io/master/magireco/assets/preview/filters.png)

Export Text

![Export Text Preview](https://raw.githubusercontent.com/Leochan6/leochan6.github.io/master/magireco/assets/preview/export_text.png)

List Statistics

![List Statistics Preview](https://raw.githubusercontent.com/Leochan6/leochan6.github.io/master/magireco/assets/preview/list_statistics.png)