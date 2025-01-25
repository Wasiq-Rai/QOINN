import { AlarmClockOff, ArrowDownNarrowWide, ArrowUpNarrowWide, TrendingUp, TrendingDown, UserCheck, BarChart2, ShieldCheck, Clock, Settings , LucideIcon} from "lucide-react";

interface IInfoCard {
    title: string;
    icon: LucideIcon;
    bodyText: string;
    id: number;
}

const infoCards: IInfoCard[] = [
    {
        title: "Increased Sales",
        bodyText: "Insightful's predictive analytics identify high-value prospects for targeted pitches, boosting conversion rates and sales by up to 20%.",
        icon: ArrowUpNarrowWide,
        id: 1
    },
    {
        title: "No Time Wasted",
        bodyText: "Insightful automates personalized content creation, freeing up sales reps' time for revenue-focused activities and increased productivity.",
        icon: AlarmClockOff,
        id: 2
    },
    {
        title: "Decreased Churn",
        bodyText: "Insightful's AI lead engagement and renewal tools reduce customer churn by up to 30% through consistent outreach and retention opportunities.",
        icon: ArrowDownNarrowWide,
        id: 3
    },
    {
        title: "Optimized Trading",
        bodyText: "Our trading bot uses advanced algorithms to optimize trade entries and exits, maximizing your profits with minimal risk.",
        icon: TrendingUp,
        id: 4
    },
    {
        title: "Risk Management",
        bodyText: "Automated risk management features protect your investments by setting stop-loss and take-profit levels tailored to your risk tolerance.",
        icon: ShieldCheck,
        id: 5
    },
    {
        title: "Real-time Analytics",
        bodyText: "Get real-time market data and analytics to make informed trading decisions and stay ahead of market trends.",
        icon: BarChart2,
        id: 6
    },
    {
        title: "24/7 Trading",
        bodyText: "Our bot operates 24/7, ensuring you never miss a trading opportunity, even when you're offline or asleep.",
        icon: Clock,
        id: 7
    },
    {
        title: "User-Friendly Interface",
        bodyText: "Designed with the user in mind, our interface is intuitive and easy to navigate, making trading accessible for everyone.",
        icon: UserCheck,
        id: 8
    },
    {
        title: "Customizable Strategies",
        bodyText: "Tailor the bot's trading strategies to match your personal trading style and preferences, ensuring optimal performance.",
        icon: Settings,
        id: 9
    },
    {
        title: "Market Insights",
        bodyText: "Gain access to exclusive market insights and forecasts, helping you make more informed trading decisions.",
        icon: TrendingDown,
        id: 10
    },
]

export default infoCards;
