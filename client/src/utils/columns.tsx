import { FC, useCallback, useEffect, useRef, useState } from "react";

import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import storage  from '../firebase';
import { Column, CellProps } from 'react-table';

//const serverApi = process.env.REACT_APP_SERVER_API;
const serverApi = "http://localhost:5000";


export const COLUMNS:Column<any>[] = [
  {
    Header: 'Image',
    accessor: 'imgUrl',
    Cell: ({ cell }: CellProps<any>) => {
      const imageUrl = cell.row.original.imgUrl;
      const [transformedUrl, setTransformedUrl] = useState<string | null>(null);

      useEffect(() => {
        const transformImageUrl = async () => {
          const fileNameMatch = imageUrl.match(/\/([^\/]+)$/);

          if (fileNameMatch) {
            const fileName = fileNameMatch[1];
            const transformedImageUrl = `images/${fileName}`;
            const storageRef = ref(storage, transformedImageUrl);

            try {
              const url = await getDownloadURL(storageRef);
              setTransformedUrl(url);
            } catch (error) {
              console.error('Error getting download URL:', error);
              setTransformedUrl(imageUrl);
            }
          } else {
            setTransformedUrl(imageUrl);
          }
        };

        transformImageUrl();
      }, [imageUrl]);

      return (
        <div>
          {transformedUrl ? (
            <img height={34} width={34} alt="productImg" src={transformedUrl} />
          ) : (
            <div>Loading...</div>
          )}
        </div>
      );
    },
  },
  {
    Header: "Title",
    accessor: "title",
  },
  {
    Header: "Description",
    accessor: "description",
  },
  {
    Header: "Category",
    accessor: "category",
  },
  {
    Header: "Size",
    accessor: "sizes[0].value",
  },

  {
    Header: "Price",
    accessor: "sizes[0].price",
  },
];
