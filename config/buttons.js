const navButtons = [
  {
    label: "SOP",
    path: "/sop",
    includeRole: [],
    excludeRole: []
  },
  {
    label: "Analytic",
    path: "/analytic",
    includeRole: ["SUPER", "MERCHANDISE", "ADM MERCHANDISE", "GA MKT"],
    excludeRole: []
  },
  {
    label: "Report",
    path: "/report",
    includeRole: ["SUPER", "MERCHANDISE", "ADM MERCHANDISE", "GA MKT"],
    excludeRole: []
  },
  {
    label: "Product",
    path: "/product",
    includeRole: [],
    excludeRole: []
  },
  {
    label: "Catalog",
    path: "/catalogs",
    includeRole: [],
    excludeRole: []
  },
  {
    label: "Change Password",
    path: "/change-password",
    includeRole: [],
    excludeRole: []
  }
];

export default navButtons;
