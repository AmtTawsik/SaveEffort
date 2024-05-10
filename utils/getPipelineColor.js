export default (colors, currentStage, selectedStage) => {
	

	if (selectedStage > currentStage)
		return { "bg": "#F3F4F6", "text": "#6B7280" };
	else if(!colors) 
    return { "bg": "#059669", "text": "#ffffff" }
  else 
    return colors[selectedStage % colors.length];
	
};