export const OVERLAY_LABELS = {
  left: {
    title: "SKIP",
    style: {
      label: {
        backgroundColor: "rgba(255, 99, 99, 0.8)",
        borderColor: "#ff6363",
        borderWidth: 1,
        color: "white",
        fontSize: 20,
        fontWeight: "600",
        padding: 12,
        borderRadius: 12,
        overflow: "hidden",
      },
      wrapper: {
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        marginTop: 20,
        marginLeft: -20,
      },
    },
  },
  right: {
    title: "LIKE",
    style: {
      label: {
        backgroundColor: "rgba(72, 187, 120, 0.8)",
        borderColor: "#48bb78",
        borderWidth: 1,
        color: "white",
        fontSize: 20,
        fontWeight: "600",
        padding: 12,
        borderRadius: 12,
        overflow: "hidden",
      },
      wrapper: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        marginTop: 20,
        marginLeft: 20,
      },
    },
  },
  top: {
    title: "FAVORITE",
    style: {
      label: {
        backgroundColor: "rgba(236, 201, 75, 0.8)",
        borderColor: "#ecc94b",
        borderWidth: 1,
        color: "white",
        fontSize: 20,
        fontWeight: "600",
        padding: 12,
        borderRadius: 12,
        overflow: "hidden",
      },
      wrapper: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
      },
    },
  },
};
