const serverApi = process.env.REACT_APP_SERVER_API;

export const COLUMNS = [
    {
        Header: 'Image',
        accessor: 'imgUrl',
        Cell: (row: any) => {
            return <div><img height={34} width={34} alt='productImg'
            src={`${serverApi}${row.cell.value.replace('/uploads', 'uploads/')}`}/></div>
        },
    },
    {
        Header: 'Title',
        accessor: 'title',
    },
    {
        Header: 'Description',
        accessor: 'description',
    },
    {
        Header: 'Category',
        accessor: 'category',
    },
    {
        Header: 'Size',
        accessor: 'sizes[0].value'
    },

    {
        Header: 'Price',
        accessor: 'sizes[0].price'
    },
    
]