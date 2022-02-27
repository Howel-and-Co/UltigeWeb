const navButtons = [
  {
    label: "Analytic",
    path: "/analytic",
    includeRole: [],
    excludeRole: ["SALES CS"]
  },
  {
    label: "Report",
    path: "/report",
    includeRole: [],
    excludeRole: ["SALES CS"]
  },
  {
    label: "Product",
    path: "/product",
    includeRole: ["SUPER", "SALES CS"],
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
