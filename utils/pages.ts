export interface NavLink {
      label: string;
      path: string;
      icon: string;
      color: string;
      children?: NavLink[];
}
const pages: NavLink[] = [
      {
            label: 'Products',
            path: '/products',
            icon: 'pictures',
            color: 'purple',
            children: [
                  {
                        label: 'Create Product',
                        path: '/products/create',
                        icon: 'add',
                        color: 'purple',
                  },
                  {
                        label: 'Size Charts',
                        path: '/products/size-charts',
                        icon: 'notes',
                        color: 'purple',
                  }
            ]
      },
      {
            label: 'Images',
            path: '/images',
            icon: 'images',
            color: 'blue'
      },
      {
            label: 'Upload',
            path: '/images/upload',
            icon: 'upload',
            color: 'cyan'
      },
      {
            label: 'Reviews',
            path: '/reviews',
            icon: 'star-full',
            color: 'yellow'
      }
]

export default pages