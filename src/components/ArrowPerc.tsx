const ArrowPerc = (perc: string, perc_r: string) => {
  const diff =
    parseFloat(perc.replaceAll(",", ".")) -
    parseFloat(perc_r.replaceAll(",", "."));
  if (diff > 0) {
    return (
      <span className="text-green-600 text-xs">
        {" "}
        ↑ <span className="text-tiny">{diff.toFixed(2)}</span>
      </span>
    );
  }
  if (diff < 0) {
    return (
      <span className="text-red-600 text-xs">
        {" "}
        ↓ <span className="text-tiny">{diff.toFixed(2)}</span>
      </span>
    );
  }
  return <span className="text-gray-600"></span>;
};

export default ArrowPerc;
