# TaxonomyPicker
A datatype for Umbraco for selecting Google Product Taxonomy Categories

NuGet: [https://www.nuget.org/packages/TaxonomyPicker](https://www.nuget.org/packages/TaxonomyPicker)

Umbraco Package: [https://our.umbraco.org/projects/backoffice-extensions/taxonomypicker](https://our.umbraco.org/projects/backoffice-extensions/taxonomypicker)

## Usage
The datatype lets you pick the appropriate category either by using the drill down select boxes, or be searching for a keyword.

![](https://raw.githubusercontent.com/mortenbock/TaxonomyPicker/master/content/DataType.png)

## Configuration
By default, the datatype includes the en-US taxonomy file, but you can override this by applying a url to fetch the taxonomy definition from instead.

The url will be requested via Ajax, so it must be browsable by a backend user, and not a file path to the App_Data folder for example.

![](https://raw.githubusercontent.com/mortenbock/TaxonomyPicker/master/content/PrevalueEditor.png)
