import { routes } from "@/shared/routes/routes";
import {
  BookmarkPlus,
  Clock,
  Film,
  Home,
  PlayCircle,
  Search,
  Star,
  TrendingUp,
  Tv,
  Users,
  Zap,
} from "lucide-react";

export const navigationItems = [
  { path: routes.route.home, label: "Home", icon: Home },
  { path: routes.route.tvshows, label: "Programas de TV", icon: Tv },
  { path: routes.route.seasons, label: "Temporadas", icon: Film },
  { path: routes.route.episodes, label: "Episodios", icon: PlayCircle },
  { path: routes.route.watchlists, label: "Minhas Listas", icon: BookmarkPlus },
] as const;

export const featuredShows = [
  {
    title: "Breaking Bad",
    genre: "Drama",
    rating: 9.5,
    year: 2008,
    description:
      "Um professor de quimica se transforma em um dos maiores traficantes do pais.",
    gradient: "from-amber-600/20 via-orange-600/10 to-transparent",
  },
  {
    title: "Stranger Things",
    genre: "Ficcao Cientifica",
    rating: 8.7,
    year: 2016,
    description:
      "Um grupo de jovens enfrenta forcas sobrenaturais em uma cidade misteriosa.",
    gradient: "from-red-600/20 via-purple-600/10 to-transparent",
  },
  {
    title: "The Office",
    genre: "Comedia",
    rating: 9.0,
    year: 2005,
    description:
      "O dia a dia hilario de funcionarios de um escritorio de vendas de papel.",
    gradient: "from-blue-600/20 via-cyan-600/10 to-transparent",
  },
  {
    title: "Dark",
    genre: "Suspense",
    rating: 8.8,
    year: 2017,
    description:
      "Quatro familias descobrem segredos sobre viagens no tempo em uma cidade alema.",
    gradient: "from-indigo-600/20 via-blue-600/10 to-transparent",
  },
  {
    title: "The Mandalorian",
    genre: "Aventura",
    rating: 8.7,
    year: 2019,
    description:
      "Um caco-recompensas solitario navega pelos confins da galaxia.",
    gradient: "from-emerald-600/20 via-teal-600/10 to-transparent",
  },
] as const;

export const stats = [
  { icon: Tv, value: "500+", label: "Programas de TV" },
  { icon: Film, value: "2.000+", label: "Temporadas" },
  { icon: PlayCircle, value: "25.000+", label: "Episodios" },
  { icon: Users, value: "10.000+", label: "Usuarios ativos" },
] as const;

export const features = [
  {
    icon: Search,
    title: "Busca Inteligente",
    description:
      "Encontre qualquer programa, temporada ou episodio em segundos com nossa busca avancada.",
  },
  {
    icon: BookmarkPlus,
    title: "Listas Personalizadas",
    description:
      "Crie e organize suas proprias listas de favoritos do seu jeito.",
  },
  {
    icon: Star,
    title: "Avaliacoes Detalhadas",
    description: "Avalie e acompanhe a qualidade de cada episodio e temporada.",
  },
  {
    icon: Clock,
    title: "Historico Completo",
    description:
      "Mantenha o controle de tudo que voce assistiu e quando assistiu.",
  },
  {
    icon: TrendingUp,
    title: "Tendencias",
    description: "Descubra os programas mais populares e em alta no momento.",
  },
  {
    icon: Zap,
    title: "Rapido e Leve",
    description:
      "Interface otimizada para uma experiencia fluida em qualquer dispositivo.",
  },
] as const;

export const quickLinks = [
  {
    icon: Tv,
    title: "Programas de TV",
    description: "Explore o catalogo completo",
    path: routes.route.tvshows,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Film,
    title: "Temporadas",
    description: "Navegue por temporadas",
    path: routes.route.seasons,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: PlayCircle,
    title: "Episodios",
    description: "Todos os episodios",
    path: routes.route.episodes,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    icon: BookmarkPlus,
    title: "Minhas Listas",
    description: "Seus favoritos",
    path: routes.route.watchlists,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
] as const;
