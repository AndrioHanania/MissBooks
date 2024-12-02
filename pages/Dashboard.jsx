import { bookService } from "../services/book.service.js";

const { VictoryChart, VictoryAxis, VictoryLabel, VictoryBar } = Victory;
const { useEffect, useState } = React;

export function Dashboard() {
    const [categoryPercentage, setCategoryPercentage] = useState({});


    useEffect(() => {
        fetchCategoryPercentages();
    }, []);

    useEffect(() => {
        console.log("categoryPercentage: ", categoryPercentage);
    }, [categoryPercentage]);

    async function fetchCategoryPercentages() {
        const percentages = await getBooksPercentageByCategory();
        setCategoryPercentage(percentages);
    }

    async function getBooksPercentageByCategory() {
        try {
            const books = await bookService.query();
            let totalBooks = 0;

            const categoryCount = books.reduce((map, book) => {
                book.categories.forEach(category => {
                    if (!map[category]) map[category] = 0;
                    map[category]++;
                });
                totalBooks += book.categories.length;
                return map;
            }, {});

            const categoryPercentage = Object.keys(categoryCount).reduce((percentageMap, category) => {
                percentageMap[category] = ((categoryCount[category] / totalBooks) * 100).toFixed(2);
                return percentageMap;
            }, {});

            return categoryPercentage;
        } catch (err) {
            console.error("Error calculating books percentage by category:", err);
            return {};
        }
    }

    const ChartData = Object.entries(categoryPercentage).map(([category, percentage]) => ({
        category,
        percentage: parseFloat(percentage),
    }));
    
    return (
        <section className="dashboard">
            <h1>Dashboard</h1>


            <VictoryChart 
                domainPadding={50} 
                padding={{ top: 30, bottom: 100, left: 100, right: 100 }}
            > 
                <VictoryAxis 
                    label="Categories"
                    style={{
                        tickLabels: { textAnchor: "middle", fontSize: 12, fontWeight: "bold" },
                        axisLabel: { padding: 40 }     
                    }}
                /> 
                <VictoryAxis 
                    dependentAxis 
                    label="Percentages"
                    tickFormat={(x) => `${x}%`}
                    style={{ 
                        tickLabels: { fontSize: 12, fontWeight: "bold" }, 
                        axisLabel: { padding: 50 },
                        grid: { stroke: 'lightgray', strokeDasharray: '5,5' }
                    }}
                /> 
                <VictoryBar 
                    data={ChartData} 
                    x="category"
                    y="percentage"
                    barWidth={40}
                    style={{
                        data: { fill: "#87DBFC" },
                    }}
                    labels={({ datum }) => `${datum.percentage}%`}
                    labelComponent={<VictoryLabel dy={({ datum }) => (datum.percentage < 10 ? 0 : 10)} 
                    style={{ 
                        fill: "black", 
                        fontSize: 10, 
                        textAnchor: "middle"
                    }}/>}
                    cornerRadius={4}
                /> 
            </VictoryChart>
        </section>
    );
};