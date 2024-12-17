#!/usr/bin/env python3

import argparse
import pandas as pd
import zarr
import numpy as np
import os
import shutil


def threeDCoordinatesZarr(
    df, columnXName, columnYName, columnZName, outputZarr, verbose=False
):
    dataSetLength = len(df)

    # Create new zarr length with shape (1, len()*3)
    z = zarr.zeros(dataSetLength * 3, dtype="f4")

    # Fill with x, y, z, in one linear array
    z = df[[columnXName, columnYName, columnZName]].values.flatten()

    # Make sure z is Float32
    z = z.astype("float32")

    if verbose:
        # Preview first 6 elements of each array
        # (the first two points in 3D)
        print(z[:6])

    # Save zarr
    zarr.save(outputZarr, z)


def attributeZarr(df, columnName, outputZarr, verbose=False):
    dataSetLength = len(df)
    dataFrameColumn = df[columnName]

    # If outputZarr exists, delete it
    if os.path.exists(outputZarr):
        shutil.rmtree(outputZarr)

    store = zarr.DirectoryStore(outputZarr)

    # Create new zarr length with shape (1, len())
    z = zarr.create(shape=(dataSetLength,), dtype="i4", store=store)

    # Find the unique values in dataFrameColumn
    uniqueValues = dataFrameColumn.unique()

    # Turn it into a list so we can easily find the index of a value
    uniqueValues = list(uniqueValues)

    if verbose:
        print(uniqueValues)

    # Fill z with the indexes of the uniqueValues
    for i, value in enumerate(dataFrameColumn):
        z[i] = uniqueValues.index(value)

    # Fill z.attrs["map"] with uniqueValues
    z.attrs["map"] = uniqueValues

    if verbose:
        # Preview first 6 elements of each array
        # (the first six attributes for the first six points)
        print(z[:6])

        # Print attributes
        print(z.attrs["map"])


def main():
    parser = argparse.ArgumentParser(description="Process CSV and generate Zarr files.")
    parser.add_argument("csv_file", help="Input CSV file")
    parser.add_argument("--output_folder", default=None, help="Output folder")
    parser.add_argument(
        "--coords_columns",
        nargs=3,
        default=["UMAP1", "UMAP2", "UMAP3"],
        help="Columns for x, y, z coordinates",
    )
    parser.add_argument(
        "--attribute_columns",
        nargs="*",
        default=["celltype"],
        help="Columns to process as attributes",
    )
    parser.add_argument(
        "--add_random_category",
        action="store_true",
        help="Add random category column for testing",
    )
    parser.add_argument(
        "--random_category_column_name",
        default="Category",
        help="Name of the random category column",
    )
    parser.add_argument("--verbose", action="store_true", help="Print verbose output")
    args = parser.parse_args()

    # Process arguments
    csv_file = args.csv_file

    if args.output_folder is not None:
        output_folder = args.output_folder
    else:
        # Derive output folder from csv_file
        fileNameWithoutExtension = os.path.splitext(os.path.basename(csv_file))[0]
        output_folder = f"public/{fileNameWithoutExtension}"

    coords_columns = args.coords_columns
    attribute_columns = args.attribute_columns

    add_random_category = args.add_random_category
    random_category_column_name = args.random_category_column_name
    verbose = args.verbose

    # Now, read the CSV file
    df = pd.read_csv(csv_file)

    # Optionally add random category
    if add_random_category:
        df[random_category_column_name] = np.random.randint(0, 4, df.shape[0])
        if random_category_column_name not in attribute_columns:
            attribute_columns.append(random_category_column_name)

    # Ensure output folder exists
    os.makedirs(output_folder, exist_ok=True)

    # Generate Zarr files
    print("Generating coordinates Zarr...")
    threeDCoordinatesZarr(
        df,
        coords_columns[0],
        coords_columns[1],
        coords_columns[2],
        f"{output_folder}/coords.zarr",
        verbose=verbose,
    )

    for attribute_column in attribute_columns:
        print(f"Generating attribute Zarr for {attribute_column}...")
        attributeZarr(
            df,
            attribute_column,
            f"{output_folder}/attribute_{attribute_column}.zarr",
            verbose=verbose,
        )


if __name__ == "__main__":
    main()
