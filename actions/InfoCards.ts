import { TrendingUp, BarChart2, ShieldCheck, Clock, UserCheck, Settings, ArrowUpRight, ArrowDownRight, LineChart, TrendingDown, LucideIcon } from "lucide-react";

interface IInfoCard {
    title: string;
    icon: LucideIcon;
    bodyText: string;
    id: number;
}

const infoCards: IInfoCard[] = [
    {
        title: "Higher Returns",
        bodyText: "QOINN's model aims for consistent, optimized portfolio growth.",
        icon: TrendingUp,
        id: 1
    },
    {
        title: "Daily Updates",
        bodyText: "Track theoretical and real values of QOINN effortlessly.",
        icon: Clock,
        id: 2
    },
    {
        title: "Risk Control",
        bodyText: "Mitigate investment risks with our smart allocation strategies.",
        icon: ShieldCheck,
        id: 3
    },
    {
        title: "Stock Insights",
        bodyText: "See which stocks QOINN favors with scoring metrics.",
        icon: BarChart2,
        id: 4
    },
    {
        title: "Subscription Plan",
        bodyText: "Unlock exclusive access to QOINN's investment strategy.",
        icon: UserCheck,
        id: 5
    },
    {
        title: "Performance View",
        bodyText: "Compare QOINN's performance with VOO and SPY.",
        icon: LineChart,
        id: 6
    },
    {
        title: "Smart Investing",
        bodyText: "Make informed decisions with our strategic insights.",
        icon: Settings,
        id: 7
    },
    {
        title: "Growth Potential",
        bodyText: "Evaluate past performance to shape future investments.",
        icon: ArrowUpRight,
        id: 8
    },
    {
        title: "Market Trends",
        bodyText: "Stay updated with the latest financial market shifts.",
        icon: TrendingDown,
        id: 9
    },
    {
        title: "Investment Stats",
        bodyText: "Analyze real vs. theoretical trading for better insights.",
        icon: ArrowDownRight,
        id: 10
    },
]

export default infoCards;
