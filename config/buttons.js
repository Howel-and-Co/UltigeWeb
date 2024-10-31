const navButtons = [
  {
    label: "SOP ",
    path: "/sop",
    includeRole: [],
    excludeRole: ["TAILOR"]
  },
  {
    label: "Tailor Scan",
    path: "/tailor/scan",
    includeRole: ["TAILOR"],
    excludeRole: []
  },
  {
    label: "Tailor Salary",
    path: "/tailor/salary",
    includeRole: ["TAILOR"],
    excludeRole: []
  },
  {
    label: "Analytic",
    path: "/analytic",
    includeRole: ["SUPER", "MERCHANDISE", "ADM MERCHANDISE", "GA MKT", "ACCOUNTING"],
    excludeRole: []
  },
  {
    label: "Report",
    path: "/report",
    includeRole: ["SUPER", "MERCHANDISE", "ADM MERCHANDISE", "GA MKT"],
    excludeRole: []
  },
  {
    label: "Report Deliver",
    path: "/report-deliver",
    includeRole: ["SUPER", "MERCHANDISE", "ADM MERCHANDISE", "GA MKT"],
    excludeRole: []
  },
  {
    label: "Stock",
    path: "/stock",
    includeRole: ["SUPER"],
    excludeRole: []
  },
  {
    label: "Transfer Request",
    path: "/transfer-request",
    includeRole: ["SUPER"],
    excludeRole: []
  },
  {
    label: "Manual Release",
    path: "/manual-release",
    includeRole: ["SUPER"],
    excludeRole: []
  },
  {
    label: "Purchase Order",
    path: "/purchase-order",
    includeRole: ["SUPER"],
    excludeRole: []
  },
  { 
    label: "Delivery Order",
    path: "/delivery-order",
    includeRole: ["SUPER", "MERCHANDISE"],
    excludeRole: []
  },
  {
    label: "Product",
    path: "/product",
    includeRole: [],
    excludeRole: ["TAILOR"]
  },
  {
    label: "Catalog",
    path: "/catalogs",
    includeRole: [],
    excludeRole: ["TAILOR"]
  },
  {
    label: "Change Password",
    path: "/change-password",
    includeRole: [],
    excludeRole: []
  }
];

export default navButtons;
