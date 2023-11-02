var bus_color_map = new Map();
var train_color_map = new Map();

bus_color_map.set('1', "#FFBF00")
bus_color_map.set('8', "#FFBF00")
bus_color_map.set('9', "#FFBF00")
bus_color_map.set('10', "#FFBF00")
bus_color_map.set('170', "#FFBF00")
bus_color_map.set('171', "#FFBF00")
bus_color_map.set('220', "#FFBF00")
bus_color_map.set('221', "#FFBF00")
bus_color_map.set('222', "#FFBF00")
bus_color_map.set('CT3', "#FFBF00")
bus_color_map.set('SL4', "#BBBBBB")
bus_color_map.set('SL5', "#BBBBBB")

train_color_map.set('orange', '#ec7014')
train_color_map.set('green', '#238b45')

var all_colors_map = new Map([...train_color_map, ...bus_color_map])
all_colors_map.set('bus', "#FFBF00")

var display_name_map = new Map()
display_name_map.set('1', "1")
display_name_map.set('8', "8")
display_name_map.set('9', "9")
display_name_map.set('10', "10")
display_name_map.set('15', '15')
display_name_map.set('170', "170")
display_name_map.set('171', "171")
display_name_map.set('220', "220")
display_name_map.set('221', "221")
display_name_map.set('222', "222")
display_name_map.set('CT3', "CT3")
display_name_map.set('SL4', "SL4")
display_name_map.set('SL5', "SL5")
display_name_map.set('orange', 'Orange')
display_name_map.set('green', 'Green')

display_name_map.set('Orange', 'orange')
display_name_map.set('Green', 'green')

var time_period_map = new Map()
time_period_map.set('Very Early Morning', "3AM-5:59AM")
time_period_map.set('Early AM', "6AM-6:59AM")
time_period_map.set('AM Peak', "7AM-8:59AM")
time_period_map.set('Midday Base', "9AM-1:29PM")
time_period_map.set('Midday School', '1:30PM-3:59PM')
time_period_map.set('PM Peak', "4PM-6:29PM")
time_period_map.set('Evening', "6:30PM-9:59PM")
time_period_map.set('Late Evening', "10PM-11:59PM")
time_period_map.set('Night', "12AM-2:59AM")


